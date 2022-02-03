export function convertToRgb(hex: string): [number, number, number] {
  const aRgbHex: any = hex.match(/.{1,2}/g);
  return [parseInt(aRgbHex[0], 16), parseInt(aRgbHex[1], 16), parseInt(aRgbHex[2], 16)];
}
