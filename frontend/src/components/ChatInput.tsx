import { useState } from "react";

function sendMessage(socket: WebSocket, msg: string) {
  socket.send(
    JSON.stringify({
      type: "guessWord",
      content: {
        word: msg.trim(),
      },
    })
  );
}

export default function ChatInput({ socket }: { socket: WebSocket }) {
  const [data, setData] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(socket, data);
        setData("");
      }}
    >
      <input type="text" value={data} onChange={(e) => setData(e.target.value)} />
      <button type="submit">Send</button>
    </form>
  );
}
