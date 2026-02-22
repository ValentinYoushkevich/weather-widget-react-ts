import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchData, WeatherData } from "@/utils/fetchData";

interface TownsContextType {
  allTowns: WeatherData[];
  errorMessage: string;
  addTown: (title: string) => Promise<void>;
  deleteTown: (townName: string) => void;
  clearError: () => void;
  reorderTowns: (towns: WeatherData[]) => void;
}

const TownsContext = createContext<TownsContextType | null>(null);

export const useTowns = () => {
  const ctx = useContext(TownsContext);
  if (!ctx) throw new Error("useTowns must be used within TownsProvider");
  return ctx;
};

export const TownsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allTowns, setAllTowns] = useState<WeatherData[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkLocalTowns = async () => {
      const localData = localStorage.getItem("wWidget");
      if (localData) {
        const names: string[] = JSON.parse(localData);
        const towns = await Promise.all(names.map((name) => fetchData(name)));
        setAllTowns(towns.filter((t) => t.id));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          try {
            const geo = await fetch(
              `https://geocode-maps.yandex.ru/1.x/?apikey=cce21e0b-bdeb-4cd1-9e27-ceee4072b7c6&format=json&kind=locality&geocode=${lng},${lat}`
            ).then((r) => r.json());
            const cityName =
              geo.response.GeoObjectCollection.featureMember[0]?.GeoObject.name;
            if (cityName) {
              const town = await fetchData(cityName);
              if (town.id) {
                setAllTowns([town]);
                localStorage.setItem("wWidget", JSON.stringify([town.name]));
              }
            }
          } catch (e) {
            console.error("Geo error:", e);
          }
        },
        (err) => console.log("Geolocation error:", err)
      );
    };
    checkLocalTowns();
  }, []);

  const addTown = useCallback(async (title: string) => {
    const newTown = await fetchData(title);
    if (newTown.cod === "404") {
      setErrorMessage(newTown.message || "City not found");
      return;
    }
    if (newTown.id) {
      setAllTowns((prev) => {
        if (prev.some((t) => t.name === newTown.name)) {
          setErrorMessage("This city has already been added");
          return prev;
        }
        const updated = [...prev, newTown];
        localStorage.setItem("wWidget", JSON.stringify(updated.map((t) => t.name)));
        setErrorMessage("");
        return updated;
      });
    }
  }, []);

  const deleteTown = useCallback((townName: string) => {
    setAllTowns((prev) => {
      const updated = prev.filter((t) => t.name !== townName);
      if (!updated.length) {
        localStorage.removeItem("wWidget");
      } else {
        localStorage.setItem("wWidget", JSON.stringify(updated.map((t) => t.name)));
      }
      return updated;
    });
  }, []);

  const clearError = useCallback(() => setErrorMessage(""), []);

  const reorderTowns = useCallback((towns: WeatherData[]) => {
    setAllTowns(towns);
    localStorage.setItem("wWidget", JSON.stringify(towns.map((t) => t.name)));
  }, []);

  return (
    <TownsContext.Provider value={{ allTowns, errorMessage, addTown, deleteTown, clearError, reorderTowns }}>
      {children}
    </TownsContext.Provider>
  );
};
