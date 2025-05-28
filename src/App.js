import React, { useState } from 'react';
import { getCurrentWeather, getForecast } from './weathershow';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './App.css'; 

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      setWeather(null);
      setForecast(null);
      return;
    }

    try {
      const data = await getCurrentWeather(city);
      setWeather(data);
      setError('');

      const forecastData = await getForecast(data.coord.lat, data.coord.lon);
      setForecast(forecastData);
    } catch (err) {
      setError('City not found or API error');
      setWeather(null);
      setForecast(null);
    }
  };

  const chartData = forecast
    ? {
        labels: forecast.list.filter((_, idx) => idx % 8 === 0).map(item => new Date(item.dt_txt).toLocaleDateString()),
        datasets: [
          {
            label: 'Temperature (°C)',
            data: forecast.list.filter((_, idx) => idx % 8 === 0).map(item => item.main.temp),
            fill: false,
            borderColor: '#00bcd4',
            tension: 0.3,
          },
        ],
      }
    : null;

  return (
    <div className="app-container">
      <h1 className="main-heading">Weather App</h1>

      <div className="input-section">
        <input
          type="text"
          className="input-box"
          placeholder="Enter city name"
          value={city}
          onChange={e => setCity(e.target.value)}
        />
        <button className="get-btn" onClick={fetchWeather}>Get Weather</button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <p>Temperature: {weather.main.temp} °C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather Icon"
          />
          <p>Condition: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
      )}

      {forecast && (
        <div className="chart-container">
          <h3>5-Day Forecast</h3>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
}

export default App;
