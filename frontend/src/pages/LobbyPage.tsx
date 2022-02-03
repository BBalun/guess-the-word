import { useState } from "react";
import { useCustomEventListener } from "../hooks/customEventHook";

function startGame(socket: WebSocket) {
  socket.send(JSON.stringify({ type: "startGame" }));
}

type LobbyPageProps = {
  gameId: string;
  players: string[];
  isOwner: boolean;
  socket: WebSocket;
};

export default function LobbyPage({ gameId, players, isOwner, socket }: LobbyPageProps) {
  const [lobby, setLobby] = useState(players);

  useCustomEventListener("update-lobby", ({ lobby }: { lobby: string[] }) => {
    setLobby(lobby);
  });

  return (
    <div>
      <h1>Game ID: {gameId}</h1>
      {lobby.map((name, i) => (
        <p key={name}>
          {i}. {name}
        </p>
      ))}
      <button disabled={!isOwner} onClick={() => startGame(socket)}>
        Start game
      </button>
    </div>
  );
}
