export const temperatureRounding = (temp: number): number => {
  return temp < 0 ? Math.ceil(temp) : Math.floor(temp);
};
