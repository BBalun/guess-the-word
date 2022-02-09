use serde::{Deserialize, Serialize};

use super::DrawPixelData;

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "type", content = "content", rename_all = "camelCase")]
pub enum ClientMessage {
    CreateGame(CreateGameData),
    JoinGame(JoinGameData),
    StartGame,
    DrawPixel(DrawPixelData),
    GuessWord(GuessWordData),
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CreateGameData {
    pub player_name: String,
    pub number_of_rounds: u32,
    pub round_length: u32,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct JoinGameData {
    pub player_name: String,
    pub game_id: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct GuessWordData {
    pub word: String,
}
