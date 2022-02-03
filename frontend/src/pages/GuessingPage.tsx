import ChatInput from "../components/ChatInput";
import ChatWindow from "../components/ChatWindow";
import ReadOnlyCanvas from "../components/ReadOnlyCanvas";

export default function GuessingPage({ socket }: { socket: WebSocket }) {
  return (
    <>
      <h1>Guess a word</h1>
      <ReadOnlyCanvas></ReadOnlyCanvas>
      <ChatWindow></ChatWindow>
      <ChatInput socket={socket}></ChatInput>
    </>
  );
}
