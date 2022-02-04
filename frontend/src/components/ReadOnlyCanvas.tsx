import { Box } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useCustomEventListener } from "../hooks/customEventHook";

type EventData = {
  posX: number;
  posY: number;
  rgb: [number, number, number];
};

export default function ReadOnlyCanvas() {
  const canvasRef = useRef(null);
  // const [prevPos, setPrevPos] = useState<[number, number]>();

  useCustomEventListener("draw-pixel", (data: EventData) => {
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const [r, g, b] = data.rgb;

    // if (prevPos == undefined) {
    //   setPrevPos([data.posX, data.posY]);
    //   return;
    // }
    // const [prevX, prevY] = prevPos;

    // ctx.beginPath();
    // ctx.lineWidth = 5;
    // ctx.lineCap = "round";
    // ctx.strokeStyle = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    // ctx.moveTo(prevX, prevY);
    // ctx.lineTo(data.posX, data.posY);
    // ctx.closePath();
    // ctx.stroke();

    // setPrevPos([data.posX, data.posY]);

    ctx.fillStyle = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    ctx.fillRect(data.posX, data.posY, 3, 3);
  });

  return (
    <Box border="4px">
      <canvas width="700" height="500" ref={canvasRef}></canvas>
    </Box>
  );
}
