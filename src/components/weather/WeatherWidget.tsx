import React from "react";
import "./weather.css";
import { TownsProvider, useTowns } from "@/store/towns";
import TownCard from "@/components/weather/TownCard";
import WidgetEmpty from "@/components/weather/WidgetEmpty";
import Settings from "@/components/weather/Settings";

const WeatherWidgetInner: React.FC = () => {
  const { allTowns } = useTowns();

  return (
    <div className="widget-wrapper">
      {allTowns.map((town) => (
        <TownCard key={town.id} town={town} />
      ))}
      {!allTowns.length && <WidgetEmpty />}
      <Settings />
    </div>
  );
};

const WeatherWidget: React.FC = () => (
  <TownsProvider>
    <div className="weather-widget">
      <WeatherWidgetInner />
    </div>
  </TownsProvider>
);

export default WeatherWidget;
