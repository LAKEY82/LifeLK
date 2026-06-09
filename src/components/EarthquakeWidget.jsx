import { useState, useEffect } from 'react';
import { ShieldAlert, AlertCircle, Compass, RefreshCw } from 'lucide-react';
import { fetchEarthquakes } from '../services/api';
import MetricCard from './MetricCard';

export default function EarthquakeWidget() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEarthquakes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEarthquakes();
      setEarthquakes(data);
    } catch (err) {
      setError('Unable to load seismic reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEarthquakes();
  }, []);

  return (
    <MetricCard
      title="Recent Regional Seismic Activity"
      icon={ShieldAlert}
      loading={loading}
      error={error}
      onRetry={loadEarthquakes}
    >
      <div className="flex flex-col h-full gap-3">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
          Events within 2000km of Sri Lanka
        </span>

        {/* Warning card for any severe events */}
        {earthquakes.some(e => e.magnitude >= 4.5) && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start gap-2.5 text-xs animate-[pulse_2s_infinite]">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-rose-500" />
            <div className="flex flex-col">
              <span className="font-bold">Seismic Warning Issued</span>
              <span className="text-[10.5px] opacity-90 mt-0.5">
                Moderate to high magnitude earthquakes detected near regional borders. Review safety guidelines if coastal/seaside.
              </span>
            </div>
          </div>
        )}

        {/* Earthquake list */}
        <div className="flex-1 max-h-[200px] overflow-y-auto space-y-2 pr-1">
          {earthquakes.length > 0 ? (
            earthquakes.map((eq) => {
              const isHigh = eq.magnitude >= 4.0;
              const isModerate = eq.magnitude >= 3.0 && eq.magnitude < 4.0;
              
              return (
                <div
                  key={eq.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                    isHigh
                      ? 'bg-rose-500/5 border-rose-500/20 text-rose-450'
                      : isModerate
                      ? 'bg-amber-500/5 border-amber-500/15 text-amber-450'
                      : 'bg-slate-900/20 dark:bg-slate-900/30 border-slate-900/40 dark:border-slate-850/40 text-slate-300 light-mode:bg-slate-50 light-mode:border-slate-200/80 light-mode:text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Magnitude Badge */}
                    <div className={`h-9 w-9 rounded-xl font-display font-extrabold flex items-center justify-center shrink-0 border ${
                      isHigh
                        ? 'bg-rose-500/15 border-rose-500/20 text-rose-400'
                        : isModerate
                        ? 'bg-amber-500/15 border-amber-500/20 text-amber-400'
                        : 'bg-slate-800/40 border-slate-750 text-slate-400'
                    }`}>
                      {eq.magnitude.toFixed(1)}
                    </div>
                    
                    <div className="flex flex-col min-w-0 pr-1">
                      <span className="font-bold text-slate-200 light-mode:text-slate-800 truncate text-[11px]">{eq.place}</span>
                      <span className="text-[9px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Compass className="h-3 w-3 shrink-0" />
                        Depth: {eq.depth.toFixed(0)} km &bull; {eq.time}
                      </span>
                    </div>
                  </div>
                  
                  {isHigh && (
                    <span className="text-[8px] uppercase font-extrabold px-1.5 py-0.5 rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/20 shrink-0">
                      High
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <span className="text-slate-500 text-xs block text-center py-4">No recent seismic events detected.</span>
          )}
        </div>
      </div>
    </MetricCard>
  );
}
