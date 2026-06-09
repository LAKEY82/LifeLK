import { useState, useEffect } from 'react';
import { CloudRain, Wind, Droplets, Thermometer, MapPin } from 'lucide-react';
import { fetchWeather } from '../services/api';
import MetricCard from './MetricCard';

const CITIES = ['Colombo', 'Kandy', 'Galle', 'Jaffna','Kurunegala', 'Anuradhapura', 'Trincomalee', 'Batticaloa', 'Matara', 'Nuwara Eliya'];

export default function WeatherWidget() {
  const [selectedCity, setSelectedCity] = useState('Colombo');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeather = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
    } catch (err) {
      setError('Unable to load weather. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity]);

  // Generate a localized Sri Lankan weather advisory based on values
  const getWeatherAdvisory = () => {
    if (!weatherData || !weatherData.current) return null;
    const temp = weatherData.current.temp_c;
    const humidity = weatherData.current.humidity;
    const desc = weatherData.current.condition.text.toLowerCase();

    if (temp >= 32) {
      return { type: 'heat', message: 'High heat index. Avoid direct noon sun & keep hydrated.' };
    }
    if (desc.includes('rain') || desc.includes('shower') || desc.includes('drizzle')) {
      return { type: 'rain', message: 'Showers reported. Carry an umbrella & drive safely.' };
    }
    if (humidity >= 85) {
      return { type: 'humidity', message: 'High humidity level. Expect warm, sticky conditions.' };
    }
    return { type: 'normal', message: 'Pleasant tropical weather. Ideal for outdoor activities.' };
  };

  const advisory = getWeatherAdvisory();

  return (
    <MetricCard
      title="Weather Forecast"
      icon={CloudRain}
      loading={loading}
      error={error}
      onRetry={() => loadWeather(selectedCity)}
    >
      <div className="flex flex-col h-full justify-between gap-4">
{/* City Dropdown */}
<div className="p-1 bg-slate-900/60 dark:bg-slate-900/80 light-mode:bg-slate-200/50 rounded-xl border border-slate-800/40 dark:border-slate-800/40 light-mode:border-slate-300/60">

  <select
    value={selectedCity}
    onChange={(e) => setSelectedCity(e.target.value)}
    className="
      w-full py-2 px-3 rounded-lg text-xs font-semibold
      bg-transparent
      text-slate-200 light-mode:text-slate-800
      outline-none cursor-pointer
      hover:bg-slate-800/40 light-mode:hover:bg-slate-100/60
      transition-all
    "
  >
    {CITIES.map((city) => (
      <option 
        key={city} 
        value={city}
        className="bg-slate-900 text-white"
      >
        {city}
      </option>
    ))}
  </select>

</div>

        {weatherData && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Current Condition Header */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-slate-400 light-mode:text-slate-500 text-xs font-medium">
                  <MapPin className="h-3 w-3 text-teal-400" />
                  <span>{weatherData.location.name}, Sri Lanka</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-extrabold tracking-tight font-display text-slate-100 light-mode:text-slate-850">
                    {Math.round(weatherData.current.temp_c)}°C
                  </span>
                  <span className="text-xs text-slate-400 light-mode:text-slate-500">
                    Feels like {Math.round(weatherData.current.feelslike_c)}°
                  </span>
                </div>
                <span className="text-sm font-semibold text-teal-400 light-mode:text-teal-600 mt-1">
                  {weatherData.current.condition.text}
                </span>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                <img
                  src={weatherData.current.condition.icon}
                  alt={weatherData.current.condition.text}
                  className="h-16 w-16 relative z-10 drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Current Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/30 border border-slate-850/40 light-mode:bg-slate-100/50 light-mode:border-slate-200/50">
                <Droplets className="h-4 w-4 text-sky-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Humidity</span>
                  <span className="text-xs font-bold text-slate-200 light-mode:text-slate-700">{weatherData.current.humidity}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/30 border border-slate-850/40 light-mode:bg-slate-100/50 light-mode:border-slate-200/50">
                <Wind className="h-4 w-4 text-amber-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Wind</span>
                  <span className="text-xs font-bold text-slate-200 light-mode:text-slate-700">{weatherData.current.wind_kph} km/h</span>
                </div>
              </div>
            </div>

            {/* 3-Day Forecast */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-900/20 dark:border-slate-800/40 light-mode:border-slate-200/60">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">3-Day Forecast</span>
              <div className="flex flex-col gap-2">
                {weatherData.forecast.forecastday.map((day, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 hover:bg-slate-900/10 light-mode:hover:bg-slate-100/40 rounded px-1 transition-colors">
                    <span className="w-20 font-medium text-slate-400 light-mode:text-slate-600">{day.date}</span>
                    <div className="flex items-center gap-1.5 flex-1 pl-4">
                      <img src={day.day.condition.icon} alt="" className="w-6 h-6 object-contain" />
                      <span className="text-slate-300 light-mode:text-slate-700 text-[11px] truncate max-w-[100px]">{day.day.condition.text}</span>
                    </div>
                    <span className="font-semibold text-slate-200 light-mode:text-slate-800">
                      {Math.round(day.day.maxtemp_c)}° / <span className="text-slate-500">{Math.round(day.day.mintemp_c)}°</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Local Advisory */}
            {advisory && (
              <div className={`mt-1 p-2.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
                advisory.type === 'heat' 
                  ? 'bg-amber-500/5 border-amber-500/20 text-amber-400'
                  : advisory.type === 'rain'
                  ? 'bg-sky-500/5 border-sky-500/20 text-sky-400'
                  : advisory.type === 'humidity'
                  ? 'bg-teal-500/5 border-teal-500/20 text-teal-400'
                  : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
              }`}>
                <Thermometer className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{advisory.message}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </MetricCard>
  );
}
