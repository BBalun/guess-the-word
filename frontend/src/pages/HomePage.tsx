import CreateGame from "../components/CreateGame";
import JoinGame from "../components/JoinGame";

export default function HomePage({ socket }: { socket: WebSocket }) {
  return (
    <div>
      <CreateGame socket={socket} />
      <JoinGame socket={socket} />
    </div>
  );
}
