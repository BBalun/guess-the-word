import { Center, HStack } from "@chakra-ui/react";
import CreateGame from "../components/CreateGame";
import JoinGame from "../components/JoinGame";

export default function HomePage({ socket }: { socket: WebSocket }) {
  return (
    <Center height="100vh">
      <HStack spacing="20" align="flex-start">
        <CreateGame socket={socket} />
        <JoinGame socket={socket} />
      </HStack>
    </Center>
  );
}
