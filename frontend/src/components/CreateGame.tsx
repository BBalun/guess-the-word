import {
  Button,
  Center,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

function createGame(socket: WebSocket, playerName: string, numberOfRounds: number, roundLength: number) {
  socket.send(
    JSON.stringify({
      type: "createGame",
      content: {
        playerName,
        numberOfRounds,
        roundLength,
      },
    })
  );
}

export default function CreateGame({ socket }: { socket: WebSocket }) {
  const [name, setName] = useState("");
  const [numberOfRounds, setNumberOfRounds] = useState(3);
  const [roundLength, setRoundLength] = useState(30);

  function onSubmit(e: any) {
    e.preventDefault();
    createGame(socket, name, numberOfRounds, roundLength);
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
            required
          />

          <label htmlFor="numberOfRounds">Number of rounds:</label>
          <NumberInput
            defaultValue={3}
            min={1}
            max={10}
            id="numberOfRounds"
            value={numberOfRounds}
            onChange={(str) => setNumberOfRounds(parseInt(str))}
            required
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <label htmlFor="roundLength">Round length (sec):</label>
          <NumberInput
            defaultValue={30}
            min={1}
            max={360}
            id="roundLength"
            value={roundLength}
            onChange={(str) => setRoundLength(parseInt(str))}
            required
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Button colorScheme="blue" type="submit">
            Create game
          </Button>
        </Stack>
      </VStack>
    </Center>
  );
}
