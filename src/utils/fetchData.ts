export interface AirQuality {
  aqi: number; // 1-5
  components: {
    pm2_5: number;
    pm10: number;
    no2: number;
    o3: number;
    co: number;
    so2: number;
  };
}

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
  coord: {
    lat: number;
    lon: number;
  };
  airQuality?: AirQuality;
}

const API_KEY = "a11318b7b69a8670ac33c8afc1e25b47";

const fetchAirQuality = async (lat: number, lon: number): Promise<AirQuality | undefined> => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    ).then((r) => r.json());
    const item = res.list?.[0];
    if (item) {
      return {
        aqi: item.main.aqi,
        components: {
          pm2_5: item.components.pm2_5,
          pm10: item.components.pm10,
          no2: item.components.no2,
          o3: item.components.o3,
          co: item.components.co,
          so2: item.components.so2,
        },
      };
    }
  } catch (e) {
    console.error("AQI fetch error:", e);
  }
  return undefined;
};

export const fetchData = async (title: string): Promise<WeatherData> => {
  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${title}&appid=${API_KEY}&units=metric`
  ).then((res) => res.json());

  if (data.coord) {
    data.airQuality = await fetchAirQuality(data.coord.lat, data.coord.lon);
  }

  return data;
};
