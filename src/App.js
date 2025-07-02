import React from 'react';
import AircraftMap from './AircraftMap';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <AircraftMap feedUrl="http://localhost:8086/Feed/AircraftList.json" />
  );
}

export default App;
