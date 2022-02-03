import { useEffect } from "react";

// const getElement = (function () {
//     const targetElement = document.createElement('div')

//     return function () {
//         return targetElement;
//     }
// }());

export function useCustomEventListener<T>(eventName: string, eventHandler: (data: T) => void): void {
  useEffect(() => {
    const handleEvent = (event: CustomEvent | Event) => {
      const data = (event as CustomEvent).detail;
      eventHandler(data);
    };

    document.addEventListener(eventName, handleEvent, false);

    return () => {
      document.removeEventListener(eventName, handleEvent, false);
    };
  });
}

export function emitCustomEvent<T>(eventName: string, data?: T): void {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}
