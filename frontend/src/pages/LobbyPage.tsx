import { Box, Button, Center, Heading, HStack, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useCustomEventListener } from "../hooks/customEventHook";
import { Text } from "@chakra-ui/react";

function startGame(socket: WebSocket) {
  socket.send(JSON.stringify({ type: "startGame" }));
}

type LobbyPageProps = {
  gameId: string;
  players: string[];
  isOwner: boolean;
  socket: WebSocket;
};

export default function LobbyPage({ gameId, players, isOwner, socket }: LobbyPageProps) {
  const [lobby, setLobby] = useState(players);

  useCustomEventListener("update-lobby", ({ lobby }: { lobby: string[] }) => {
    setLobby(lobby);
  });

  return (
    <Center height="100vh">
      <Stack>
        <Heading>Game ID: {gameId}</Heading>
        <Heading>Players:</Heading>
        {lobby.map((name, i) => (
          <HStack key={name}>
            <Box fontWeight="bold">{i + 1}.</Box>
            <Box>{name}</Box>
          </HStack>
        ))}
        <Button
          alignSelf="flex-end"
          maxWidth="36"
          colorScheme="blue"
          disabled={!isOwner}
          onClick={() => startGame(socket)}
        >
          Start game
        </Button>
      </Stack>
    </Center>
  );
}
