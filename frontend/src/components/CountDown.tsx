import { Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function CountDown({ roundLength }: { roundLength: number }) {
  const [count, setCount] = useState(roundLength);
  useEffect(() => {
    const interval = setInterval(() => {
      if (count > 0) {
        setCount((c) => c - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return <Heading>Time: {count}</Heading>;
}
