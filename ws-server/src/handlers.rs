use crate::{server::Server, ws, Result};
use warp::Reply;

pub async fn ws_handler(ws: warp::ws::Ws, server: Server) -> Result<impl Reply> {
    Ok(ws.on_upgrade(move |socket| ws::client_connection(socket, server)))
}

pub async fn timeout_handler(game_id: String, round: usize, server: Server) -> Result<impl Reply> {
    match server.find_game(&game_id).await {
        Some(game) => {
            let mut game = game.lock().await;
            game.timeout(round).await;
            Ok(round.to_string())
        }
        None => Err(warp::reject::not_found()),
    }
}
