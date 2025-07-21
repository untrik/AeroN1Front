import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';  // стили для иконок

const AircraftMap = ({ feedUrl, onSelectAircraft, selectedAircraft }) => {
  const [aircraft, setAircraft] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(feedUrl);
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setAircraft(data);
      } catch (err) {
        console.error('Ошибка получения данных:', err);
      }
    };

    fetchData();
    // Обновляем данные каждые 5 секунд, чтобы соответствовать частоте сервера
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [feedUrl]);

  // Функция для объединения широт и долгот в массив точек [[lat, lon], ...]
  const getFlightPath = (aircraft) => {
    if (!aircraft?.latitudes || !aircraft?.longitudes || 
        aircraft.latitudes.length !== aircraft.longitudes.length) {
      return [];
    }
    return aircraft.latitudes.map((lat, i) => [lat, aircraft.longitudes[i]]);
  };

  return (
    <MapContainer center={[55, 37]} zoom={5} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Маршрут выбранного самолета */}
      {selectedAircraft && getFlightPath(selectedAircraft).length > 0 && (
        <>
          <Polyline
            positions={getFlightPath(selectedAircraft)}
            color="red"
            weight={2}
            opacity={0.7}
          />
          {getFlightPath(selectedAircraft).map((pos, idx) => (
            <CircleMarker
              key={idx}
              center={pos}
              radius={3}
              color="red"
              fillOpacity={0.7}
            />
          ))}
        </>
      )}

      

      {aircraft.map(ac => {
        const { id, latitude, longitude, callsign, altitude, speed, track } = ac;
        // Конвертируем скорость из м/с в км/ч для корректного отображения
        const speedKmh = Math.round(speed * 3.6);

        // Див-иконка самолетом-эмодзи, повернутая по курсу, увеличенного размера
        const planeIcon = L.divIcon({
          html: `<div class="plane-icon" style="transform: rotate(${track}deg); font-size: 36px;">✈️</div>`,
          className: '', // убираем фон
          iconSize: [50, 50],
          iconAnchor: [25, 25], // центр иконки
        });

        return (
          <Marker
            key={id}
            position={[latitude, longitude]}
            icon={planeIcon}
            eventHandlers={{
              click: () => onSelectAircraft && onSelectAircraft(ac)
            }}
          >
            <Popup>
              <div>
                <b>{callsign.trim() || 'N/A'}</b><br />
                Alt: {Math.round(altitude)} m<br />
                Spd: {speedKmh} km/h
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default AircraftMap;
