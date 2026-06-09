import { useState, useEffect } from 'react';
import { ShieldAlert, Info, ExternalLink, CalendarDays } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';
import WeatherWidget from './components/WeatherWidget';
import FuelWidget from './components/FuelWidget';
import HolidayWidget from './components/HolidayWidget';
import FinanceWidget from './components/FinanceWidget';
import EarthquakeWidget from './components/EarthquakeWidget';
import EmergencyWidget from './components/EmergencyWidget';

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAlert, setShowAlert] = useState(true);

  // Live Colombo Clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Colombo'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Colombo'
    });
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Top Banner Alert (Pro UX feature) */}
      {showAlert && (
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white text-xs py-2.5 px-4 flex justify-between items-center relative z-40 shadow-md">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <ShieldAlert className="h-4 w-4 shrink-0 animate-pulse-glow" />
            <span className="font-semibold">Life Hub Alert:</span>
            <span className="opacity-90 leading-tight">
              Fuel prices adjusted nationally on June 9th. Multi-source caching is active for Jedach API stability.
            </span>
          </div>
          <button
            onClick={() => setShowAlert(false)}
            className="text-white/80 hover:text-white font-extrabold text-sm ml-2 cursor-pointer focus:outline-none"
            aria-label="Dismiss alert"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Header */}
      <header className="py-6 px-4 md:px-8 border-b border-slate-900/10 dark:border-slate-900/40 light-mode:border-slate-200 bg-slate-950/20 backdrop-blur-md sticky top-0 z-30 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl lk-gradient-bg flex items-center justify-center shadow-lg shadow-teal-500/10 hover:scale-105 transition-transform duration-300">
              <CalendarDays className="h-5.5 w-5.5 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black font-display tracking-tight leading-none text-slate-100 light-mode:text-slate-900">
                Sri Lankan <span className="lk-gradient-text">Life Hub</span>
              </h1>
              <p className="text-[10px] md:text-xs text-slate-400 light-mode:text-slate-500 font-semibold mt-1">
                Real-time Public Utilities, Fuel Tracker & Weather Portal
              </p>
            </div>
          </div>

          {/* Clock & Controls */}
          <div className="flex items-center gap-4">
            {/* Live Clock Card */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-display font-black text-sm text-slate-100 light-mode:text-slate-800 tabular-nums">
                {formatTime(currentTime)}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 light-mode:text-slate-500 font-bold mt-0.5">
                {formatDate(currentTime)} (SL Time)
              </span>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Dashboard Grid Container */}
      <main className="flex-grow py-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Responsive Grid System: Adjusts cols dynamically */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* ROW 1: Weather (1col) and Fuel Widget (2col) */}
          <div className="col-span-1">
            <WeatherWidget />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <FuelWidget />
          </div>

          {/* ROW 2: Holiday (1col), Finance (1col), Earthquakes (1col) */}
          <div className="col-span-1">
            <HolidayWidget />
          </div>

          <div className="col-span-1">
            <FinanceWidget />
          </div>

          <div className="col-span-1">
            <EarthquakeWidget />
          </div>

          {/* ROW 3: Emergency Contacts (1col) */}
          <div className="col-span-1">
            <EmergencyWidget />
          </div>

          {/* Information Notice Card (Spans remainder of grid space in layout) */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 glass-panel p-6 flex flex-col justify-between border-slate-900/10 dark:border-slate-900/40 light-mode:border-slate-200 bg-slate-900/10 dark:bg-slate-900/20 light-mode:bg-slate-50 relative overflow-hidden group">
            {/* Soft background glow */}
            <div className="absolute top-12 -right-12 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            
            <div className="flex items-start gap-3">
              <Info className="h-5.5 w-5.5 text-teal-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1.5">
                <h4 className="font-display font-bold text-sm text-slate-100 light-mode:text-slate-800">
                  Developer Integration & API Policies
                </h4>
                <p className="text-xs text-slate-400 light-mode:text-slate-600 leading-relaxed max-w-2xl">
                  This frontend dashboard directly communicates with the open-source infrastructure networks. Keys are secured through Vite environment bindings and cached locally using local storage limits to respect rate margins. Feel free to clone the source, request partner keys, or inspect live network triggers.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-slate-900/10 dark:border-slate-800/40 light-mode:border-slate-250/60 text-[11px] font-bold text-slate-400 light-mode:text-slate-500 relative z-10">
              <a
                href="https://github.com/jedach/fuel-api"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-teal-400 transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                Jedach Fuel API Docs
              </a>
              <a
                href="https://www.weatherapi.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-teal-400 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                WeatherAPI
              </a>
              <a
                href="https://holidayapi.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-teal-400 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                HolidayAPI
              </a>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900/10 dark:border-slate-900/40 light-mode:border-slate-200 mt-12 bg-slate-950/40 light-mode:bg-slate-100 text-center text-xs text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 font-semibold">
          <span>&copy; {new Date().getFullYear()} Sri Lankan Life Hub. All rights reserved.</span>
          <div className="flex gap-4">
            <span>Powered by React + Vite + Tailwind CSS</span>
            <span>&bull;</span>
            <span className="text-teal-400 light-mode:text-teal-600">Vercel Deployment Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
