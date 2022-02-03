use serde::{Deserialize, Serialize};

pub mod client_messages;
pub mod server_messages;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct DrawPixelData {
    pub pos_x: u32,
    pub pos_y: u32,
    pub rgb: (u8, u8, u8),
}
