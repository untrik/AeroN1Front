import React, { useState } from "react";
import AircraftMap from "./AircraftMap";
import AircraftInfoCard from "./AircraftInfoCard";
import "leaflet/dist/leaflet.css";

const API_OPTIONS = [
  { value: "flights", label: "Рейсы (flights)" },
  { value: "routes", label: "Маршруты (routes)" },
  { value: "airports", label: "Аэропорты (airports)" },
  { value: "airlines", label: "Авиакомпании (airlines)" },
  { value: "airplanes", label: "Самолёты (airplanes)" },
  { value: "aircraft_types", label: "Типы самолётов (aircraft_types)" },
  { value: "taxes", label: "Авианалог (taxes)" },
  { value: "cities", label: "Города (cities)" },
  { value: "countries", label: "Страны (countries)" },
];

function App() {
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [apiType, setApiType] = useState("flights");

  return (
    <>
      <div
        style={{
          padding: 16,
          background: "#f7f7f7",
          zIndex: 2000,
          position: "relative",
        }}
      >
        <label htmlFor="api-select" style={{ marginRight: 8 }}>
          Выберите API:
        </label>
        <select
          id="api-select"
          value={apiType}
          onChange={(e) => setApiType(e.target.value)}
        >
          {API_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <AircraftMap apiType={apiType} onSelectAircraft={setSelectedAircraft} />
      {selectedAircraft && (
        <AircraftInfoCard
          aircraft={selectedAircraft}
          onClose={() => setSelectedAircraft(null)}
        />
      )}
    </>
  );
}

export default App;
