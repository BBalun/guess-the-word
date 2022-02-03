use serde::{Deserialize, Serialize};

use super::DrawPixelData;

#[derive(Serialize)]
#[serde(tag = "type", content = "content", rename_all = "camelCase")]
pub enum ServerMessage {
    CreateGameResponse(CreateGameResponseData),
    JoinGameResponse(JoinGameResponseData),
    LobbyChanged { lobby: Vec<String> },
    TurnStarted(TurnStartedData),
    YourTurn { word: String },
    DrawPixelResponse(DrawPixelData),
    GuessWordResponse(GuessWordResponseData),
    TurnEnded { results: Vec<PlayerScore> },
    GameEnded { results: Vec<PlayerScore> },
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CreateGameResponseData {
    pub game_id: String,
    pub player_name: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct JoinGameResponseData {
    pub error_msg: Option<String>,
    pub lobby: Option<Vec<String>>,
    pub game_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct TurnStartedData {
    pub player_name: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct GuessWordResponseData {
    pub player_name: String,
    pub was_right: bool,
    pub display_msg: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PlayerScore {
    pub player_name: String,
    pub score: u32,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct YourTurnData {
    pub player_name: String,
}
