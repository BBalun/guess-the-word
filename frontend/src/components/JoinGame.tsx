import { Box, Button, Center, Heading, Input, Stack, VStack } from "@chakra-ui/react";
import { useState } from "react";

function joinGame(socket: WebSocket, playerName: string, gameId: string) {
  socket.send(
    JSON.stringify({
      type: "joinGame",
      content: {
        playerName,
        gameId,
      },
    })
  );
}

export default function JoinGame({ socket }: { socket: WebSocket }) {
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState("");

  function onSubmit(e: any) {
    e.preventDefault();
    joinGame(socket, name, gameId);
  }

  return (
    <Center>
      <VStack>
        <Box>
          <Heading>Join game</Heading>
        </Box>
        <Stack as="form" onSubmit={onSubmit}>
          <label htmlFor="name">Player name:</label>
          <Input
            placeholder="Enter name"
            type="text"
            id="name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            required
          />

          <label htmlFor="gameId">Game Id:</label>
          <Input
            placeholder="Enter Game Id"
            type="text"
            id="gameId"
            value={gameId}
            onChange={(e: any) => setGameId(e.target.value)}
            required
          />

          <Button colorScheme="blue" type="submit">
            Join game
          </Button>
        </Stack>
      </VStack>
    </Center>
  );
}
