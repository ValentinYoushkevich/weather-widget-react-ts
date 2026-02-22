export interface WeatherData {
  id: number;
  name: string;
  cod: string | number;
  message?: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  weather: Array<{
    description: string;
    icon: string;
    main: string;
  }>;
}

export const fetchData = async (title: string): Promise<WeatherData> => {
  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${title}&appid=a11318b7b69a8670ac33c8afc1e25b47&units=metric`
  ).then((res) => res.json());
  return data;
};
