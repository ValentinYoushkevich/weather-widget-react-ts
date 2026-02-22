export const dewPoint = (t: number, h: number): number => {
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * t) / (b + t) + Math.log(h / 100);
  return (b * alpha) / (a - alpha);
};
