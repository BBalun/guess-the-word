import { Center, Heading, Stack } from "@chakra-ui/react";
import ChatInput from "../components/ChatInput";
import ChatWindow from "../components/ChatWindow";
import ReadOnlyCanvas from "../components/ReadOnlyCanvas";

export default function GuessingPage({ socket }: { socket: WebSocket }) {
  return (
    <Center height="100vh">
      <Stack>
        <Heading>Guess a word</Heading>
        <ReadOnlyCanvas />
        <ChatWindow />
        <ChatInput socket={socket} />
      </Stack>
    </Center>
  );
}
