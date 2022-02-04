use std::sync::Arc;

use futures::{stream::SplitSink, SinkExt, StreamExt};
use tokio::sync::{mpsc, Mutex};
use tokio_stream::wrappers::UnboundedReceiverStream;
use uuid::Uuid;
use warp::ws::{Message, WebSocket};

use crate::{
    messages::{client_messages::*, server_messages::*},
    player::Player,
    server::Server, game::Game,
};

async fn forward(
    mut stream: UnboundedReceiverStream<Message>,
    mut sink: SplitSink<WebSocket, Message>,
) {
    while let Some(x) = stream.next().await {
        let _ = sink.send(x).await;
    }
}

pub async fn client_connection(ws: WebSocket, server: Arc<Server>) {
    // client_sink -> client_stream -> ws_sink
    let (ws_sink, mut ws_stream) = ws.split();
    let (client_sink, client_stream) = mpsc::unbounded_channel();
    let client_stream = UnboundedReceiverStream::new(client_stream);
    tokio::spawn(forward(client_stream, ws_sink));

    let mut player = None;
    let mut game = None;

    while let Some(Ok(msg)) = ws_stream.next().await {
        if msg.is_text() {
            let msg = msg.to_str().unwrap();

            let client_msg: ClientMessage = match serde_json::from_str(&msg) {
                Ok(res) => res,
                _ => {
                    continue;
                }
            };

            match client_msg {
                ClientMessage::CreateGame(CreateGameData { player_name }) => {
                    // TODO: rounds (either remove or add ability to change number of rounds)
                    let rounds = 3 as u32;
                    let owner = Player::new(player_name, client_sink, true);
                    let game_id = Uuid::new_v4().to_string();
                    let new_game = Game::new(game_id.clone(), rounds, owner.clone(), server.get_words(), Arc::downgrade(&server));
                    let new_game = Arc::new(Mutex::new(new_game));
                    server.add_game(new_game.clone()).await;
                    // let game_id = server.create_game(owner.clone(), 3).await;
                    owner.send(ServerMessage::CreateGameResponse(CreateGameResponseData {
                        game_id: game_id.clone(),
                        player_name: owner.name.clone(),
                    }));
                    player = Some(owner);
                    game = Some(new_game);
                    break;
                }
                ClientMessage::JoinGame(JoinGameData {
                    player_name,
                    game_id,
                }) => {
                    let new_player = Player::new(player_name, client_sink.clone(), false);
                    match server.find_game(&game_id).await {
                        Some(g) => {
                            let mut locked_game = g.lock().await;

                            if locked_game.add_player(new_player.clone()) {
                                game = Some(g.clone());
                                player = Some(new_player);
                                break;
                            }
                        }
                        None => {
                            new_player.send(ServerMessage::JoinGameResponse(
                                JoinGameResponseData {
                                    error_msg: Some("Invalid game id".to_string()),
                                    lobby: None,
                                    game_id: None,
                                },
                            ));
                        }
                    }
                }
                _ => {}
            }
        }
    }

    let player = match player {
        Some(p) => p,
        None => {
            println!("connection closed because player is missing");
            return;
        }
    };

    let game = match game {
        Some(g) => g,
        None => {
            println!("connection closed because game is missing");
            return;
        }
    };

    while let Some(Ok(msg)) = ws_stream.next().await {
        if msg.is_text() {
            let msg = msg.to_str().unwrap();

            let client_msg: ClientMessage = match serde_json::from_str(&msg) {
                Ok(res) => res,
                _ => continue,
            };

            match client_msg {
                ClientMessage::StartGame => {
                    let mut game = game.lock().await;
                    game.start(&player);
                }
                ClientMessage::DrawPixel(data) => {
                    let game = game.lock().await;
                    game.send_pixel(data, &player);
                }
                ClientMessage::GuessWord(GuessWordData { word }) => {
                    let mut game = game.lock().await;
                    game.guess_word(&player, &word).await;
                }
                _ => {}
            };
        } else if msg.is_close() {
            println!("Client disconnected...");
        }
    }

    println!("connection closed");
}
