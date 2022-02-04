use std::{convert::Infallible, sync::Arc};

use tokio::{fs::File, io::AsyncBufReadExt, io::BufReader};
use warp::{Filter, Rejection};

use crate::server::Server;

mod game;
mod handlers;
mod messages;
mod player;
mod server;
mod ws;

type Result<T> = std::result::Result<T, Rejection>;

#[tokio::main]
async fn main() {
    let words = read_words(r"C:\Users\Beny\Desktop\pv281\pv281-project\ws-server\words.txt").await;
    let server = Arc::new(Server::new(words));

    let ws_route = warp::path("ws")
        .and(warp::ws())
        .and(with_server(server.clone()))
        .and_then(handlers::ws_handler);

    let routes = ws_route.with(warp::cors().allow_any_origin());

    println!("Starting server");
    warp::serve(routes)
        .run(([127, 0, 0, 1], 8000))
        .await;
}

fn with_server(server: Arc<Server>) -> impl Filter<Extract = (Arc<Server>,), Error = Infallible> + Clone {
    warp::any().map(move || server.clone())
}

async fn read_words(file_path: &str) -> Vec<String> {
    let mut res = Vec::new();
    let file = File::open(file_path)
        .await
        .expect(&format!("File `{}` does not exist.", file_path));
    let reader = BufReader::new(file);
    let mut lines = reader.lines();

    while let Some(line) = lines
        .next_line()
        .await
        .expect("Error reading words from file.")
    {
        res.push(line.trim().to_string());
    }
    res
}
