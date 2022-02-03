use std::{collections::HashMap, sync::Arc};

use tokio::sync::{Mutex, RwLock};
use uuid::Uuid;

use crate::{game::Game, player::Player};

#[derive(Clone)]
pub struct Server {
    pub games: Arc<RwLock<HashMap<String, Arc<Mutex<Game>>>>>,
    pub words: Arc<Vec<String>>,
}

impl Server {
    pub fn new(words: Vec<String>) -> Server {
        Server {
            games: Arc::new(RwLock::new(HashMap::new())),
            words: Arc::new(words),
        }
    }

    pub async fn create_game(&self, owner: Player, rounds: u32) -> String {
        let id = Uuid::new_v4().to_string();
        self.games.write().await.insert(
            id.clone(),
            Arc::new(Mutex::new(Game::new(
                id.clone(),
                rounds,
                owner,
                self.words.clone(),
            ))),
        );
        id
    }

    pub async fn find_game(&self, game_id: &str) -> Option<Arc<Mutex<Game>>> {
        let games = self.games.read().await;
        games.get(game_id).map(|game| game.clone())
    }
}
