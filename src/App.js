import React, { useState } from "react";
import AircraftMap from "./AircraftMap";
import AircraftInfoCard from "./AircraftInfoCard";
import "leaflet/dist/leaflet.css";

const API_OPTIONS = [
  { value: "opensky", label: "OpenSky (локальный)" },
  { value: "flights", label: "Рейсы (flights, aviationstack)" },
  { value: "routes", label: "Маршруты (routes, aviationstack)" },
  { value: "airports", label: "Аэропорты (airports, aviationstack)" },
  { value: "airlines", label: "Авиакомпании (airlines, aviationstack)" },
  { value: "airplanes", label: "Самолёты (airplanes, aviationstack)" },
  { value: "aircraft_types", label: "Типы самолётов (aviationstack)" },
  { value: "taxes", label: "Авианалог (aviationstack)" },
  { value: "cities", label: "Города (aviationstack)" },
  { value: "countries", label: "Страны (aviationstack)" },
];

function App() {
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [apiType, setApiType] = useState("opensky");

  return (
    <>

      <AircraftMap
        feedUrl="http://localhost:8086/Feed/AircraftList.json"
        onSelectAircraft={setSelectedAircraft}
        selectedAircraft={selectedAircraft}
      />

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
