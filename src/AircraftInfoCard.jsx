import React from 'react';
import './AircraftInfoCard.css';

const AircraftInfoCard = ({ aircraft, onClose }) => {
  if (!aircraft) return null;
  const {
    callsign,
    id,
    latitude,
    longitude,
    altitude,
    speed,
    track,
    verticalRate,
    squawk,
    icao24,
    registration,
    originCountry,
    lastSeen,
    onGround
  } = aircraft;

  return (
    <div className="aircraft-info-card">
      <button className="close-btn" onClick={onClose}>×</button>
      <h2>Информация о самолёте</h2>
      <div><b>Позывной:</b> {callsign || 'N/A'}</div>
      <div><b>Регистрация:</b> {registration || 'N/A'}</div>
      <div><b>ICAO24:</b> {icao24 || id || 'N/A'}</div>
      <div><b>Страна:</b> {originCountry || 'N/A'}</div>
      <div><b>Широта:</b> {latitude}</div>
      <div><b>Долгота:</b> {longitude}</div>
      <div><b>Высота:</b> {altitude ? Math.round(altitude) + ' м' : 'N/A'}</div>
      <div><b>Скорость:</b> {speed ? Math.round(speed * 3.6) + ' км/ч' : 'N/A'}</div>
      <div><b>Курс:</b> {track ? Math.round(track) + '°' : 'N/A'}</div>
      <div><b>Вертикальная скорость:</b> {verticalRate ? Math.round(verticalRate) + ' м/с' : 'N/A'}</div>
      <div><b>Squawk:</b> {squawk || 'N/A'}</div>
      <div><b>Последний сигнал:</b> {lastSeen ? new Date(lastSeen * 1000).toLocaleString('ru-RU') : 'N/A'}</div>
      <div><b>На земле:</b> {onGround ? 'Да' : 'Нет'}</div>
    </div>
  );
};

export default AircraftInfoCard; 