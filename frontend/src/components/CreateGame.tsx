import { Button, Center, Heading, Input, Stack, VStack } from "@chakra-ui/react";
import { useState } from "react";

function createGame(socket: WebSocket, playerName: string) {
  socket.send(
    JSON.stringify({
      type: "createGame",
      content: {
        playerName,
      },
    })
  );
}

export default function CreateGame({ socket }: { socket: WebSocket }) {
  const [name, setName] = useState("");

  function onSubmit(e: any) {
    e.preventDefault();
    createGame(socket, name);
  }
  return (
    <Center>
      <VStack>
        <Heading>Create game</Heading>
        <Stack as="form" onSubmit={onSubmit}>
          <label htmlFor="name">Player name:</label>
          <Input
            placeholder="Enter name"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button colorScheme="blue" type="submit">
            Create game
          </Button>
        </Stack>
      </VStack>
    </Center>
  );
}
