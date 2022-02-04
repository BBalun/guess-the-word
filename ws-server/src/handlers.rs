use std::sync::Arc;

use crate::{server::Server, ws, Result};
use warp::Reply;

pub async fn ws_handler(ws: warp::ws::Ws, server: Arc<Server>) -> Result<impl Reply> {
    Ok(ws.on_upgrade(move |socket| ws::client_connection(socket, server)))
}
