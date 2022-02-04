import { Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useCustomEventListener } from "../hooks/customEventHook";

type Message = {
  playerName: string;
  wasRight: boolean;
  displayMsg: string;
};

export default function ChatWindow() {
  const [messeges, setMesseges] = useState<Message[]>([]);

  useCustomEventListener("message-received", (msg: Message) => {
    setMesseges((prev) => [...prev, msg]);
  });

  return (
    <Box border="4px" resize="none" disabled={true} height="120px">
      {messeges.map((msg, i) => (
        <Text key={i} color={msg.wasRight ? "green" : "black"}>
          {msg.displayMsg}
        </Text>
      ))}
    </Box>
  );
}
