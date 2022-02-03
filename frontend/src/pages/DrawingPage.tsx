import ChatWindow from "../components/ChatWindow";
import WriteCanvas from "../components/WriteCanvas";

export default function DrawingPage({ socket, word }: { socket: WebSocket; word: string }) {
  return (
    <>
      <h1>Draw: {word}</h1>
      <WriteCanvas socket={socket}></WriteCanvas>
      <ChatWindow></ChatWindow>
    </>
  );
}
