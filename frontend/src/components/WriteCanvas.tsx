import { Box } from "@chakra-ui/react";
import { useRef, useState } from "react";

export default function WriteCanvas({ socket }: { socket: WebSocket }) {
  const canvas = useRef<any>();
  // const [pos, setPos] = useState({ x: 0, y: 0 });

  // const setPosition = (e: any) => {
  //   const rect = e.target.getBoundingClientRect();
  //   const x = e.clientX - rect.left;
  //   const y = e.clientY - rect.top;
  //   setPos({ x, y });
  // };

  const draw = (e: any) => {
    if (e.buttons !== 1) {
      return;
    }
    const ctx = canvas.current.getContext("2d");
    const rect = e.target.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    // ctx.beginPath();
    // ctx.lineWidth = 5;
    // ctx.lineCap = "round";
    // ctx.strokeStyle = "#000000";
    // ctx.moveTo(pos.x, pos.y);
    // ctx.lineTo(mouseX, mouseY);
    // ctx.closePath();
    // ctx.stroke();

    // setPosition(e);

    ctx.fillStyle = "#000000";
    ctx.fillRect(mouseX, mouseY, 3, 3);
    socket.send(
      JSON.stringify({
        type: "drawPixel",
        content: {
          posX: Math.round(mouseX),
          posY: Math.round(mouseY),
          rgb: [0, 0, 0],
        },
      })
    );
  };

  return (
    <Box border="4px">
      <canvas
        width="700"
        height="500"
        ref={canvas}
        onMouseMove={draw}
        // onMouseDown={setPosition}
        // onMouseEnter={setPosition}
      />
    </Box>
  );
}
