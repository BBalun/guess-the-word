use std::{collections::HashMap, sync::Arc};

use tokio::sync::{Mutex, RwLock};

use crate::{game::Game};

// #[derive(Clone)]
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

    // pub async fn create_game(&self, owner: Player, rounds: u32) -> String {
    //     let id = Uuid::new_v4().to_string();
    //     self.games.write().await.insert(
    //         id.clone(),
    //         Arc::new(Mutex::new(Game::new(
    //             id.clone(),
    //             rounds,
    //             owner,
    //             self.words.clone(),
    //         ))),
    //     );
    //     id
    // }

    pub async fn add_game(&self, game: Arc<Mutex<Game>>) {
        let key = game.lock().await.id.clone();
        self.games.write().await.insert(key, game);
    }

    pub fn get_words(&self) -> Arc<Vec<String>> {
        self.words.clone()
    }

    pub async fn find_game(&self, game_id: &str) -> Option<Arc<Mutex<Game>>> {
        let games = self.games.read().await;
        games.get(game_id).map(|game| game.clone())
    }

    pub async fn start_timeout(&self, game_id: &str, round: usize, timeout: u64) {
        if let Some(game) = self.find_game(game_id).await {
            tokio::spawn(async move {
                tokio::time::sleep(tokio::time::Duration::from_secs(timeout)).await;
                let mut game = game.lock().await;
                game.timeout(round).await;
            });
        }
    }
}
