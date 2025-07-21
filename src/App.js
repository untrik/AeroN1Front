import React, { useState } from "react";
import AircraftMap from "./AircraftMap";
import AircraftInfoCard from "./AircraftInfoCard";
import "leaflet/dist/leaflet.css";

function App() {
  const [selectedAircraft, setSelectedAircraft] = useState(null);

  return (
    <>
      <AircraftMap
        feedUrl="http://localhost:8086/Feed/AircraftList.json"
        onSelectAircraft={setSelectedAircraft}
        selectedAircraft={selectedAircraft}
      />
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
