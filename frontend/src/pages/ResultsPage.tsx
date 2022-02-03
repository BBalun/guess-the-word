type ResultsPageProps = {
  results: {
    playerName: string;
    score: number;
  }[];
  gameEnded: boolean;
};

export default function ResultsPage({ results, gameEnded }: ResultsPageProps) {
  return (
    <div>
      {gameEnded ? <h1>Final score:</h1> : <h1>Results:</h1>}
      {results.map((x) => {
        return (
          <p key={x.playerName}>
            {x.playerName}: {x.score}
          </p>
        );
      })}
    </div>
  );
}
