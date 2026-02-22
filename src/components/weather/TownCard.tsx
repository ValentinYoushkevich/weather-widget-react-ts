import React from "react";
import { WeatherData } from "@/utils/fetchData";
import { temperatureRounding } from "@/utils/temperatureRounding";
import { dewPoint } from "@/utils/dewPoint";
import { Eye, Droplets, Wind, Gauge, Thermometer, Leaf } from "lucide-react";

interface TownCardProps {
  town: WeatherData;
}

const windDirection = (deg: number): string => {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
};

const aqiLabels: Record<number, { text: string; color: string }> = {
  1: { text: "Good", color: "hsl(120, 60%, 50%)" },
  2: { text: "Fair", color: "hsl(60, 70%, 50%)" },
  3: { text: "Moderate", color: "hsl(30, 80%, 50%)" },
  4: { text: "Poor", color: "hsl(0, 70%, 55%)" },
  5: { text: "Very Poor", color: "hsl(0, 90%, 40%)" },
};

const TownCard: React.FC<TownCardProps> = ({ town }) => {
  const temp = temperatureRounding(town.main.temp);
  const feelsLike = temperatureRounding(town.main.feels_like);
  const dp = temperatureRounding(dewPoint(town.main.temp, town.main.humidity));
  const icon = town.weather[0]?.icon;
  const description = town.weather[0]?.description || "";
  const aqi = town.airQuality;
  const aqiInfo = aqi ? aqiLabels[aqi.aqi] : null;

  return (
    <div className="town-card">
      <div className="town-card__header">
        <h2 className="town-card__city">
          {town.name}, {town.sys.country}
        </h2>
      </div>
      <div className="town-card__main">
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description}
          className="town-card__icon"
        />
        <span className="town-card__temp">{temp > 0 ? `+${temp}` : temp}°C</span>
      </div>
      <p className="town-card__description">
        Feels like {feelsLike > 0 ? `+${feelsLike}` : feelsLike}°C. {description}.
      </p>
      <div className="town-card__details">
        <div className="town-card__detail">
          <Wind size={16} />
          <span>{town.wind.speed}m/s {windDirection(town.wind.deg)}</span>
        </div>
        <div className="town-card__detail">
          <Gauge size={16} />
          <span>{town.main.pressure}hPa</span>
        </div>
        <div className="town-card__detail">
          <Droplets size={16} />
          <span>Humidity: {town.main.humidity}%</span>
        </div>
        <div className="town-card__detail">
          <Thermometer size={16} />
          <span>Dew point: {dp}°C</span>
        </div>
        <div className="town-card__detail">
          <Eye size={16} />
          <span>Visibility: {(town.visibility / 1000).toFixed(1)}km</span>
        </div>
        {aqi && aqiInfo && (
          <div className="town-card__detail">
            <Leaf size={16} style={{ color: aqiInfo.color }} />
            <span>AQI: <strong style={{ color: aqiInfo.color }}>{aqiInfo.text}</strong></span>
          </div>
        )}
      </div>
      {aqi && (
        <div className="town-card__aqi-details">
          <span>PM2.5: {aqi.components.pm2_5}</span>
          <span>PM10: {aqi.components.pm10}</span>
          <span>O₃: {aqi.components.o3}</span>
          <span>NO₂: {aqi.components.no2}</span>
          <span>CO: {aqi.components.co}</span>
          <span>SO₂: {aqi.components.so2}</span>
        </div>
      )}
    </div>
  );
};

export default TownCard;
