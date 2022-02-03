import { useState } from "react";
import { useCustomEventListener } from "../hooks/customEventHook";

type Message = {
  playerName: string;
  wasRight: boolean;
  displayMsg: string;
};

export default function ChatWindow() {
  const [messeges, setMesseges] = useState<Message[]>([]);

  useCustomEventListener("message-received", (msg: Message) => {
    setMesseges((prev) => [...prev, msg]);
  });

  return (
    <div>
      {messeges.map((msg, i) => (
        <p key={i} style={{ color: msg.wasRight ? "green" : "black" }}>
          {msg.displayMsg}
        </p>
      ))}
    </div>
  );
}
