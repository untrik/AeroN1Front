import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';

const API_KEY = 'e4a0ef61b8e93d598668e0b0129d683d';
const OPENSKY_URL = 'http://localhost:8086/Feed/AircraftList.json';
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
        let url;
        if (apiType === 'opensky') {
          url = OPENSKY_URL;
        } else {
          url = `${BASE_URL}${apiType}`;
        }
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
        // Для opensky ожидаем массив, для aviationstack — объект с data
        if (apiType === 'opensky') {
          setData(Array.isArray(json) ? json : (json.aircraft || []));
        } else {
          setData(json.data || []);
        }
      } catch (err) {
        setError('Ошибка загрузки данных: ' + err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiType]);

  // Для opensky и flights отображаем карту
  if (apiType === 'flights' || apiType === 'opensky') {
    // Для opensky структура другая
    const isOpenSky = apiType === 'opensky';
    const aircraftList = isOpenSky
      ? data.filter(ac => ac.latitude && ac.longitude)
      : data.filter(f => f.live && f.live.latitude && f.live.longitude);
    return (
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        {loading && <div style={{position:'absolute',top:10,left:10,zIndex:1000,background:'#fff',padding:8,borderRadius:4}}>Загрузка...</div>}
        {error && <div style={{position:'absolute',top:10,left:10,zIndex:1000,background:'#fff',padding:8,borderRadius:4,color:'red'}}>{error}</div>}
        <MapContainer center={[55, 37]} zoom={5} style={{ height: '100vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {aircraftList.map((ac, idx) => {
            let lat, lon, callsign, altitude, speed, track, id, registration, originCountry, icao, lastSeen, onGround;
            if (isOpenSky) {
              lat = ac.latitude;
              lon = ac.longitude;
              callsign = ac.callsign || 'N/A';
              altitude = ac.altitude;
              speed = ac.speed;
              track = ac.track;
              id = ac.icao || ac.id || idx;
              registration = ac.registration;
              originCountry = ac.originCountry;
              icao = ac.icao;
              lastSeen = ac.lastSeen;
              onGround = ac.onGround;
            } else {
              lat = ac.live.latitude;
              lon = ac.live.longitude;
              callsign = ac.flight?.iata || ac.flight?.icao || ac.flight?.number || 'N/A';
              altitude = ac.live.altitude;
              speed = ac.live.speed_horizontal;
              track = ac.live.direction;
              id = ac.aircraft?.icao24 || ac.aircraft?.registration || idx;
              registration = ac.aircraft?.registration;
              originCountry = ac.departure?.airport;
              icao = ac.aircraft?.icao24;
              lastSeen = Date.parse(ac.live.updated)/1000;
              onGround = ac.live.is_ground;
            }
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
            const speedKmh = Math.round(speed * (isOpenSky ? 3.6 : 1));
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
