import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { emitCustomEvent } from "./hooks/customEventHook";
import DrawingPage from "./pages/DrawingPage";
import GuessingPage from "./pages/GuessingPage";
import HomePage from "./pages/HomePage";
import LobbyPage from "./pages/LobbyPage";
import ResultsPage from "./pages/ResultsPage";
import { ServerMessage } from "./types/serverMessages";

function App() {
  const socket = useMemo(() => new WebSocket("ws://localhost:8000/ws"), []);
  const [page, setPage] = useState<JSX.Element>(<HomePage socket={socket} />);

  useEffect(() => {
    socket.addEventListener("message", function (event) {
      console.log(`Msg from server: ${event.data}`);
      const data: ServerMessage = JSON.parse(event.data);
      switch (data.type) {
        case "drawPixelResponse":
          emitCustomEvent("draw-pixel", data.content);
          break;
        case "guessWordResponse":
          emitCustomEvent("message-received", data.content);
          break;
        case "lobbyChanged":
          emitCustomEvent("update-lobby", data.content);
          break;
        case "createGameResponse":
          setPage(
            <LobbyPage
              socket={socket}
              gameId={data.content.gameId}
              players={[data.content.playerName]}
              isOwner={true}
            />
          );
          break;
        case "joinGameResponse":
          if (data.content.errorMsg != null) {
            alert(`An error occured during joining a game: ${data.content.errorMsg}`);
            break;
          }
          setPage(
            <LobbyPage socket={socket} gameId={data.content.gameId!} players={data.content.lobby!} isOwner={false} />
          );
          break;
        case "turnStarted":
          setPage(<GuessingPage socket={socket} />);
          break;
        case "yourTurn":
          setPage(<DrawingPage socket={socket} word={data.content.word} />);
          break;
        case "gameEnded":
          setPage(<ResultsPage results={data.content.results} gameEnded={true} />);
          break;
        case "turnEnded":
          setPage(<ResultsPage results={data.content.results} gameEnded={false} />);
          break;
      }
    });
  }, []);

  return page;
}

export default App;
