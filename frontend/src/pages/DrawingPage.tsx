import { Center, Heading, Stack } from "@chakra-ui/react";
import ChatWindow from "../components/ChatWindow";
import WriteCanvas from "../components/WriteCanvas";

export default function DrawingPage({ socket, word }: { socket: WebSocket; word: string }) {
  return (
    <Center height="100vh">
      <Stack>
        <Heading>Draw: {word}</Heading>
        <WriteCanvas socket={socket} />
        <ChatWindow />
      </Stack>
    </Center>
  );
}
