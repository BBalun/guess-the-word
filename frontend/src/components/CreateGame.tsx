import { useState } from "react";

function createGame(socket: WebSocket, playerName: string) {
  socket.send(
    JSON.stringify({
      type: "createGame",
      content: {
        playerName,
      },
    })
  );
}

export default function CreateGame({ socket }: { socket: WebSocket }) {
  const [name, setName] = useState("");

  function onSubmit(e: any) {
    e.preventDefault();
    createGame(socket, name);
  }
  return (
    <>
      <h1>Create game</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">Player name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Create game</button>
      </form>
    </>
  );
}
