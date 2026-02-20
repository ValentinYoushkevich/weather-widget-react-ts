export const dewPoint = (t: number, h: number): number => {
  return (17.27 * t) / (237.7 + t) + Math.log(h / 100);
};
