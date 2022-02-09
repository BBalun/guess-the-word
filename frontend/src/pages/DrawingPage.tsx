import { Center, Heading, HStack, Stack } from "@chakra-ui/react";
import ChatWindow from "../components/ChatWindow";
import CountDown from "../components/CountDown";
import WriteCanvas from "../components/WriteCanvas";

export default function DrawingPage({
  socket,
  word,
  roundLength,
}: {
  socket: WebSocket;
  word: string;
  roundLength: number;
}) {
  return (
    <Center height="100vh">
      <Stack>
        <HStack justifyContent="space-between">
          <Heading>Draw: {word}</Heading>
          <CountDown roundLength={roundLength} />
        </HStack>
        <WriteCanvas socket={socket} />
        <ChatWindow />
      </Stack>
    </Center>
  );
}
