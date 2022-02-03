import { useState } from "react";

function joinGame(socket: WebSocket, playerName: string, gameId: string) {
  socket.send(
    JSON.stringify({
      type: "joinGame",
      content: {
        playerName,
        gameId,
      },
    })
  );
}

export default function JoinGame({ socket }: { socket: WebSocket }) {
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState("");

  function onSubmit(e: any) {
    e.preventDefault();
    joinGame(socket, name, gameId);
  }

  return (
    <>
      <h1>Join game</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">Player name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="gameId">Game Id:</label>
        <input type="text" id="gameId" value={gameId} onChange={(e) => setGameId(e.target.value)} />

        <button type="submit">Join game</button>
      </form>
    </>
  );
}
