use tokio::sync::mpsc::UnboundedSender;
use warp::ws::Message;

use crate::messages::server_messages::ServerMessage;

#[derive(Clone)]
pub struct Player {
    pub name: String,
    pub score: u32,
    pub is_owner: bool,
    sink: UnboundedSender<Message>,
}

impl Player {
    pub fn new(name: String, sink: UnboundedSender<Message>, is_owner: bool) -> Player {
        Player {
            name,
            score: 0,
            sink,
            is_owner,
        }
    }

    pub fn send(&self, msg: ServerMessage) {
        let response = serde_json::to_string(&msg).unwrap();
        let _ = self.send_text(&response);
    }

    pub fn send_text(
        &self,
        text: &str,
    ) -> Result<(), tokio::sync::mpsc::error::SendError<warp::ws::Message>> {
        self.sink.send(Message::text(text))
    }
}

impl PartialEq for Player {
    fn eq(&self, other: &Self) -> bool {
        self.name == other.name
    }
}
