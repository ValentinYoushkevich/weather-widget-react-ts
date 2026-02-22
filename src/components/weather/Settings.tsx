import React, { useState, useRef } from "react";
import { useTowns } from "@/store/towns";
import { WeatherData } from "@/utils/fetchData";
import { Settings as SettingsIcon, Plus, X, GripVertical } from "lucide-react";

const Settings: React.FC = () => {
  const { allTowns, errorMessage, addTown, deleteTown, clearError, reorderTowns } = useTowns();
  const [isOpen, setIsOpen] = useState(false);
  const [newCity, setNewCity] = useState("");
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleAdd = async () => {
    if (!newCity.trim()) return;
    await addTown(newCity.trim());
    setNewCity("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const items = [...allTowns];
    const [draggedItem] = items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, draggedItem);
    reorderTowns(items);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <>
      <button
        className="settings-toggle"
        onClick={() => {
          setIsOpen(!isOpen);
          clearError();
        }}
        aria-label="Settings"
      >
        <SettingsIcon size={20} />
      </button>

      {isOpen && (
        <div className="settings-panel">
          <div className="settings-panel__header">
            <h3>Settings</h3>
            <button onClick={() => { setIsOpen(false); clearError(); }}>
              <X size={18} />
            </button>
          </div>

          <div className="settings-panel__cities">
            {allTowns.map((town, index) => (
              <div
                key={town.id}
                className="settings-panel__city"
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
              >
                <GripVertical size={16} className="settings-panel__grip" />
                <span>{town.name}, {town.sys.country}</span>
                <button
                  className="settings-panel__delete"
                  onClick={() => deleteTown(town.name)}
                  aria-label={`Delete ${town.name}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="settings-panel__add">
            <h4>Add Location:</h4>
            <div className="settings-panel__input-row">
              <input
                type="text"
                value={newCity}
                onChange={(e) => { setNewCity(e.target.value); clearError(); }}
                onKeyDown={handleKeyDown}
                placeholder="Enter city name"
                className="settings-panel__input"
              />
              <button className="settings-panel__add-btn" onClick={handleAdd}>
                <Plus size={18} />
              </button>
            </div>
            {errorMessage && <p className="settings-panel__error">{errorMessage}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
