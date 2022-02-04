import { Center, Heading, Stack } from "@chakra-ui/react";

type ResultsPageProps = {
  results: {
    playerName: string;
    score: number;
  }[];
  gameEnded: boolean;
};

export default function ResultsPage({ results, gameEnded }: ResultsPageProps) {
  return (
    <Center height="100vh">
      <Stack>
        <Heading>{gameEnded ? "Final score:" : "Results:"}</Heading>
        {results.map((x, i) => {
          return (
            <Heading key={x.playerName}>
              {i + 1}. {x.playerName} ({x.score})
            </Heading>
          );
        })}
      </Stack>
    </Center>
  );
}
