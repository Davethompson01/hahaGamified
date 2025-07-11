export function createVerticalGradient(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  stops: [number, string][]
): CanvasGradient {
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  stops.forEach(([pos, color]) => gradient.addColorStop(pos, color));
  return gradient;
} 