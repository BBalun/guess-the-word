use std::{
    collections::{HashMap, HashSet},
    sync::Arc,
};

use rand::prelude::SliceRandom;

use crate::{
    messages::{server_messages::*, DrawPixelData},
    player::Player,
};

pub struct Game {
    pub id: String,
    pub players: HashMap<String, Player>,
    pub turns: u32,
    pub points: HashMap<String, u32>,
    pub player_order: Vec<String>,
    pub game_status: GameStatus,
    pub players_that_guessed_right: HashSet<String>,
    pub words: Arc<Vec<String>>,
    pub current_word: String,
}

pub enum GameStatus {
    Lobby,
    InProgress { current_round: usize },
    Finished,
}

impl Game {
    pub fn new(id: String, turns: u32, mut owner: Player, words: Arc<Vec<String>>) -> Game {
        let mut players = HashMap::new();
        owner.is_owner = true;
        players.insert(owner.name.clone(), owner);
        Game {
            id,
            turns,
            players,
            game_status: GameStatus::Lobby,
            points: HashMap::new(),
            player_order: vec![],
            players_that_guessed_right: HashSet::new(),
            words,
            current_word: String::new(),
        }
    }

    pub fn add_player(&mut self, player: Player) -> bool {
        // players can join only before game starts
        if self.game_started() {
            return false;
        }

        // check for player with same name
        if self.contains_player(&player.name) {
            player.send(ServerMessage::JoinGameResponse(JoinGameResponseData {
                error_msg: Some("Name is taken".to_string()),
                lobby: None,
                game_id: None,
            }));
            return false;
        }

        self.players.insert(player.name.clone(), player.clone());

        // send response to a player
        let lobby: Vec<String> = self.players.keys().map(|name| name.clone()).collect();
        player.send(ServerMessage::JoinGameResponse(JoinGameResponseData {
            error_msg: None,
            lobby: Some(lobby.clone()),
            game_id: Some(self.id.clone()),
        }));

        // update lobby of all other players
        self.send_to_all_except(&ServerMessage::LobbyChanged { lobby }, &player);

        return true;
    }

    /// returns true if a game already started or is finished
    pub fn game_started(&self) -> bool {
        match self.game_status {
            GameStatus::Lobby => false,
            _ => true,
        }
    }

    pub fn start(&mut self, player: &Player) {
        if !player.is_owner {
            return;
        }
        // game can be started only once
        if self.game_started() {
            return;
        }

        // change game status
        self.game_status = GameStatus::InProgress { current_round: 0 };

        // init points (score)
        for player in self.players.values() {
            self.points.insert(player.name.clone(), 0);
        }

        // init player_order
        self.player_order = self.players.values().map(|p| p.name.clone()).collect();
        for _ in 0..self.turns {
            self.player_order.append(&mut self.player_order.clone());
        }

        self.start_turn();
    }

    /// sends start turn msg to all players
    pub fn start_turn(&mut self) {
        let current_player = match self.get_current_player() {
            Some(p) => p,
            None => return,
        };
        self.current_word = self.get_random_word();
        current_player.send(ServerMessage::YourTurn {
            word: self.get_current_word(),
        });
        self.send_to_all_except(
            &ServerMessage::TurnStarted(TurnStartedData {
                player_name: current_player.name.clone(),
            }),
            &current_player,
        );
        self.start_timeout(10);
    }

    fn start_timeout(&self, timeout: u64) {
        if let GameStatus::InProgress { current_round } = self.game_status {
            let id = self.id.clone();
            tokio::spawn(async move {
                tokio::time::sleep(tokio::time::Duration::from_secs(timeout)).await;
                let _ = reqwest::get(format!(
                    "http://127.0.0.1:8000/timeout/{}/{}",
                    id, current_round
                ))
                .await;
            });
        }
    }

    /// returns a player that is now drawing
    pub fn get_current_player(&self) -> Option<Player> {
        match self.game_status {
            GameStatus::InProgress { current_round } => {
                let key = &self.player_order[current_round];
                self.players.get(key).map(|p| p.clone())
            }
            _ => None,
        }
    }

    pub fn get_random_word(&self) -> String {
        self.words
            .choose(&mut rand::thread_rng())
            .map(|word| word.clone())
            .unwrap_or("No words".to_string())
    }

    pub fn get_current_word(&self) -> String {
        self.current_word.clone()
    }

    pub async fn guess_word(&mut self, player: &Player, word: &str) {
        // check if player already found out what a word was
        if self.players_that_guessed_right.contains(&player.name) {
            return;
        }

        if word != self.get_current_word() {
            self.send_to_all(&ServerMessage::GuessWordResponse(GuessWordResponseData {
                was_right: false,
                display_msg: format!("{}: {}", &player.name, word),
                player_name: player.name.clone(),
            }));
            return;
        }
        self.add_point(player);
        self.players_that_guessed_right.insert(player.name.clone());
        self.send_to_all(&ServerMessage::GuessWordResponse(GuessWordResponseData {
            was_right: true,
            display_msg: format!("Player {} - Hit!", player.name),
            player_name: player.name.clone(),
        }));

        // check if all players guessed right
        if self.players_that_guessed_right.len() + 1 == self.players.len() {
            self.end_turn().await;
        }
    }

    /// Ends a turns. If turn was a last, ends a game instead.
    pub async fn end_turn(&mut self) {
        if let GameStatus::InProgress { current_round } = self.game_status {
            self.players_that_guessed_right.clear();
            let results = self
                .points
                .iter()
                .map(|(name, points)| PlayerScore {
                    player_name: name.clone(),
                    score: points.clone(),
                })
                .collect();
            if self.get_number_of_rounds() == current_round + 1 {
                self.finish_game(results);
                return;
            }
            self.game_status = GameStatus::InProgress {
                current_round: current_round + 1,
            };
            self.send_to_all(&ServerMessage::TurnEnded { results });

            // Wait 3 seconds and start next turn
            tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;
            self.start_turn();
        }
    }

    pub fn finish_game(&mut self, results: Vec<PlayerScore>) {
        self.players_that_guessed_right.clear();
        self.game_status = GameStatus::Finished;
        self.send_to_all(&ServerMessage::GameEnded { results });
    }

    pub fn get_number_of_rounds(&self) -> usize {
        self.players.len() * self.turns as usize
    }

    /// Add one point to a `player`
    pub fn add_point(&mut self, player: &Player) {
        if let Some(score) = self.points.get_mut(&player.name) {
            *score += 1;
        }
    }

    pub fn send_to_all(&self, msg: &ServerMessage) {
        let response = serde_json::to_string(msg).unwrap();
        for player in self.players.values() {
            let _ = player.send_text(&response);
        }
    }

    pub fn send_to_all_except(&self, msg: &ServerMessage, except: &Player) {
        let response = serde_json::to_string(msg).unwrap();
        for player in self.players.values() {
            if player != except {
                let _ = player.send_text(&response);
            }
        }
    }

    pub fn contains_player(&self, player_name: &str) -> bool {
        match self.players.get(player_name) {
            Some(_) => true,
            None => false,
        }
    }

    pub async fn timeout(&mut self, round: usize) {
        if let GameStatus::InProgress { current_round } = self.game_status {
            if current_round == round {
                self.end_turn().await;
            }
        }
    }

    pub fn send_pixel(&self, pixel_data: DrawPixelData, player: &Player) {
        self.send_to_all_except(&ServerMessage::DrawPixelResponse(pixel_data), player);
    }
}
