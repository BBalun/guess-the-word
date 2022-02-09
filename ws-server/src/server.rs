use std::{collections::HashMap, sync::Arc};

use tokio::sync::{Mutex, RwLock};

use crate::game::Game;

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

    pub async fn add_game(&self, game: Arc<Mutex<Game>>) {
        let key = game.lock().await.id.clone();
        self.games.write().await.insert(key, game);
    }

    pub fn get_words(&self) -> Arc<Vec<String>> {
        self.words.clone()
    }

    pub async fn find_game(&self, game_id: &str) -> Option<Arc<Mutex<Game>>> {
        let games = self.games.read().await;
        games.get(game_id).cloned()
    }
}
