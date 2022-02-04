import { Button, Input, Stack } from "@chakra-ui/react";
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
    <Stack
      as="form"
      onSubmit={(e: any) => {
        e.preventDefault();
        sendMessage(socket, data);
        setData("");
      }}
    >
      <Input type="text" value={data} onChange={(e: any) => setData(e.target.value)} />
      <Button type="submit">Send</Button>
    </Stack>
  );
}
