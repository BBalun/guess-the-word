export type CreateGameResponse = {
  type: "createGameResponse";
  content: {
    gameId: string;
    playerName: string;
  };
};

export type JoinGameResponse = {
  type: "joinGameResponse";
  content: {
    errorMsg?: string;
    lobby?: string[];
    gameId?: string;
  };
};

export type LobbyChanged = {
  type: "lobbyChanged";
  content: {
    lobby: string[];
  };
};

export type TurnStarted = {
  type: "turnStarted";
  content: {
    playerName: string;
    roundLength: number;
  };
};

export type YourTurn = {
  type: "yourTurn";
  content: {
    word: string;
    roundLength: number;
  };
};

export type DrawPixelResponse = {
  type: "drawPixelResponse";
  content: {
    posX: number;
    posY: number;
    rgb: [number, number, number];
  };
};

export type GuessWordResponse = {
  type: "guessWordResponse";
  content: {
    playerName: string;
    wasRight: boolean;
    displayMsg: string;
  };
};

export type TurnEnded = {
  type: "turnEnded";
  content: {
    results: Array<{
      playerName: string;
      score: number;
    }>;
  };
};

export type GameEnded = {
  type: "gameEnded";
  content: {
    results: Array<{
      playerName: string;
      score: number;
    }>;
  };
};

export type ServerMessage =
  | CreateGameResponse
  | JoinGameResponse
  | LobbyChanged
  | TurnStarted
  | YourTurn
  | DrawPixelResponse
  | GuessWordResponse
  | TurnEnded
  | GameEnded;
