import { Center, Heading, HStack, Stack } from "@chakra-ui/react";
import ChatInput from "../components/ChatInput";
import ChatWindow from "../components/ChatWindow";
import CountDown from "../components/CountDown";
import ReadOnlyCanvas from "../components/ReadOnlyCanvas";

export default function GuessingPage({ socket, roundLength }: { socket: WebSocket; roundLength: number }) {
  return (
    <Center height="100vh">
      <Stack>
        <HStack justifyContent="space-between">
          <Heading>Guess a word</Heading>
          <CountDown roundLength={roundLength} />
        </HStack>
        <ReadOnlyCanvas />
        <ChatWindow />
        <ChatInput socket={socket} />
      </Stack>
    </Center>
  );
}
