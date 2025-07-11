import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';

const API_KEY = 'e4a0ef61b8e93d598668e0b0129d683d';
const BASE_URL = 'http://localhost:8086/api/aviationstack/';

const AircraftMap = ({ apiType, onSelectAircraft }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${BASE_URL}${apiType}`;
        const res = await fetch(url);
        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch (parseErr) {
          // Если не JSON, выводим ошибку в консоль и показываем пользователю
          console.error('Ошибка парсинга JSON:', parseErr, '\nОтвет сервера:', text);
          setError('Ошибка загрузки данных: сервер вернул невалидный JSON. Подробности в консоли браузера.');
          setData([]);
          return;
        }
        setData(json.data || []);
      } catch (err) {
        setError('Ошибка загрузки данных: ' + err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiType]);

  // Только для flights отображаем карту
  if (apiType === 'flights') {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        {loading && <div style={{position:'absolute',top:10,left:10,zIndex:1000,background:'#fff',padding:8,borderRadius:4}}>Загрузка...</div>}
        {error && <div style={{position:'absolute',top:10,left:10,zIndex:1000,background:'#fff',padding:8,borderRadius:4,color:'red'}}>{error}</div>}
        <MapContainer center={[55, 37]} zoom={5} style={{ height: '100vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {data.filter(f => f.live && f.live.latitude && f.live.longitude).map((f, idx) => {
            const ac = f;
            const lat = ac.live.latitude;
            const lon = ac.live.longitude;
            const callsign = ac.flight?.iata || ac.flight?.icao || ac.flight?.number || 'N/A';
            const altitude = ac.live.altitude;
            const speed = ac.live.speed_horizontal;
            const track = ac.live.direction;
            const id = ac.aircraft?.icao24 || ac.aircraft?.registration || idx;
            const registration = ac.aircraft?.registration;
            const originCountry = ac.departure?.airport;
            const icao = ac.aircraft?.icao24;
            const lastSeen = Date.parse(ac.live.updated)/1000;
            const onGround = ac.live.is_ground;
            // Для карточки:
            const aircraftObj = {
              callsign,
              id,
              latitude: lat,
              longitude: lon,
              altitude,
              speed,
              track,
              registration,
              originCountry,
              icao,
              lastSeen,
              onGround
            };
            const speedKmh = Math.round(speed);
            const planeIcon = L.divIcon({
              html: `<div class="plane-icon" style="transform: rotate(${track}deg); font-size: 36px;">✈️</div>`,
              className: '',
              iconSize: [50, 50],
              iconAnchor: [25, 25],
            });
            return (
              <Marker
                key={id}
                position={[lat, lon]}
                icon={planeIcon}
                eventHandlers={{
                  click: () => onSelectAircraft && onSelectAircraft(aircraftObj)
                }}
              >
                <Popup>
                  <div>
                    <b>{callsign}</b><br />
                    Alt: {Math.round(altitude)} м<br />
                    Spd: {speedKmh} км/ч
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    );
  }

  // Для остальных типов — простая таблица
  return (
    <div style={{ padding: 24 }}>
      {loading && <div>Загрузка...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <h2 style={{marginTop:0}}>Данные: {apiType}</h2>
      <div style={{overflowX:'auto', maxHeight:'80vh', overflowY:'auto'}}>
        <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr>
              {data[0] && Object.keys(data[0]).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {Object.keys(row).map(key => (
                  <td key={key}>{typeof row[key] === 'object' ? JSON.stringify(row[key]) : String(row[key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && !loading && <div>Нет данных</div>}
      </div>
    </div>
  );
};

export default AircraftMap;
