import { useState, useEffect } from 'react';
import { Fuel, Search, AlertTriangle, CheckCircle, RefreshCw, Send, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { fetchFuelStatus } from '../services/api';
import MetricCard from './MetricCard';

export default function FuelWidget() {
  const [fuelData, setFuelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedFuelFilter, setSelectedFuelFilter] = useState('All');
  
  // Crowdsourcing form state
  const [reportingStationId, setReportingStationId] = useState(null);
  const [selectedFuelType, setSelectedFuelType] = useState('p92');
  const [reportedStatus, setReportedStatus] = useState('Available');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const loadFuelData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFuelStatus();
      setFuelData(data);
    } catch (err) {
      setError('Unable to load fuel pricing or stations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFuelData();
  }, []);

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportingStationId || !fuelData) return;

    // Simulate sending report to Jedach API
    setFuelData(prev => {
      const updatedStations = prev.stations.map(station => {
        if (station.id === parseInt(reportingStationId)) {
          return {
            ...station,
            [selectedFuelType]: reportedStatus,
            reportsCount: station.reportsCount + 1,
            lastReported: 'Just now'
          };
        }
        return station;
      });
      return { ...prev, stations: updatedStations };
    });

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setReportingStationId(null);
    }, 2000);
  };

  // Extract unique districts
  const districts = ['All', ...new Set(fuelData?.stations?.map(s => s.dist) || [])];

  // Filter stations
  const filteredStations = fuelData?.stations?.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          station.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistrict === 'All' || station.dist === selectedDistrict;
    
    let matchesFuel = true;
    if (selectedFuelFilter !== 'All') {
      matchesFuel = station[selectedFuelFilter] === 'Available';
    }

    return matchesSearch && matchesDistrict && matchesFuel;
  }) || [];

  return (
    <MetricCard
      title="Fuel Status & Station Tracker"
      icon={Fuel}
      loading={loading}
      error={error}
      onRetry={loadFuelData}
      className="col-span-1 md:col-span-2"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left column - Price grid */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">National Fuel Prices (LKR/L)</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {fuelData?.prices?.map((item) => (
              <div key={item.type} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/30 dark:bg-slate-900/40 border border-slate-850/40 light-mode:bg-slate-100/60 light-mode:border-slate-200/50 hover:border-teal-500/10 transition-colors">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-300 light-mode:text-slate-700">{item.type}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Last updated: {new Date(item.lastUpdated).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-100 light-mode:text-slate-800">LKR {item.price.toFixed(2)}</span>
                  {item.change !== 0 ? (
                    <span className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      item.change > 0 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/10' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                    }`}>
                      {item.change > 0 ? (
                        <>
                          <ArrowUpRight className="h-3 w-3 mr-0.5 shrink-0" />
                          +{item.change}
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-3 w-3 mr-0.5 shrink-0" />
                          {item.change}
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-800/40 px-1.5 py-0.5 rounded-md">Stable</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* District Selector & Legend */}
          <div className="mt-auto hidden lg:flex flex-col gap-2 p-3 bg-teal-500/5 rounded-xl border border-teal-500/10 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-teal-400">
              <CheckCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Crowdsourced Platform Active</span>
            </div>
            <p className="text-[11px] text-slate-400 light-mode:text-slate-600 leading-relaxed">
              Submit real-time reports below to flag availability at fuel stations and build trust weightings.
            </p>
          </div>
        </div>

        {/* Right column - Station Finder */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search station or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900/60 dark:bg-slate-900/80 border border-slate-800/60 light-mode:bg-slate-100 light-mode:border-slate-300 light-mode:text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* District dropdown */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-900/60 dark:bg-slate-900/80 border border-slate-800/60 light-mode:bg-slate-100 light-mode:border-slate-300 light-mode:text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              {districts.map(d => (
                <option key={d} value={d}>{d === 'All' ? 'All Districts' : d}</option>
              ))}
            </select>
          </div>

          {/* Quick Fuel Availability Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] text-slate-500 font-bold mr-1 uppercase">Available:</span>
            {[
              { id: 'All', label: 'All Stocks' },
              { id: 'p92', label: '92 Octane' },
              { id: 'p95', label: '95 Octane' },
              { id: 'autoD', label: 'Auto Diesel' },
              { id: 'superD', label: 'Super Diesel' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedFuelFilter(filter.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                  selectedFuelFilter === filter.id
                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                    : 'bg-slate-900/40 border border-slate-800/60 text-slate-400 hover:text-slate-300 light-mode:bg-slate-100 light-mode:border-slate-200 light-mode:text-slate-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Station List */}
          <div className="flex-1 max-h-[250px] lg:max-h-[300px] overflow-y-auto space-y-2 pr-1">
            {filteredStations.length > 0 ? (
              filteredStations.map((station) => (
                <div key={station.id} className="p-3 rounded-xl bg-slate-900/20 dark:bg-slate-900/40 border border-slate-900/40 dark:border-slate-850/40 light-mode:bg-slate-50 light-mode:border-slate-200/80 hover:border-teal-500/10 transition-colors flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 light-mode:text-slate-800">{station.name}</h4>
                      <p className="text-[10px] text-slate-400 light-mode:text-slate-500 mt-0.5">{station.location}</p>
                    </div>
                    <button
                      onClick={() => setReportingStationId(station.id)}
                      className="px-2 py-1 rounded-lg text-[9px] font-bold bg-teal-500/15 text-teal-400 border border-teal-500/20 hover:bg-teal-500/25 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Plus className="h-3 w-3" />
                      Report
                    </button>
                  </div>

                  {/* Stock Grid */}
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[9px] font-bold">
                    {[
                      { key: 'p92', label: '92 Octane' },
                      { key: 'p95', label: '95 Octane' },
                      { key: 'autoD', label: 'Auto Diesel' },
                      { key: 'superD', label: 'Super Diesel' }
                    ].map(fuel => {
                      const status = station[fuel.key];
                      return (
                        <div key={fuel.key} className={`p-1 rounded-md flex flex-col border ${
                          status === 'Available'
                            ? 'bg-emerald-500/5 border-emerald-500/15 text-emerald-400'
                            : status === 'Low Stock'
                            ? 'bg-amber-500/5 border-amber-500/15 text-amber-400'
                            : 'bg-rose-500/5 border-rose-500/15 text-rose-400'
                        }`}>
                          <span className="text-[8px] opacity-70 mb-0.5">{fuel.label}</span>
                          <span>{status}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer status */}
                  <div className="flex justify-between items-center text-[9px] text-slate-500">
                    <span>Verified reports: {station.reportsCount}</span>
                    <span>Last reported: {station.lastReported}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-xs">
                <AlertTriangle className="h-8 w-8 text-amber-500 mb-2 shrink-0 animate-pulse" />
                <span>No fuel stations found matching filters.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reporting Modal / Drawer Overlay */}
      {reportingStationId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full p-6 bg-slate-900 border-slate-800 shadow-2xl relative animate-fade-in light-mode:bg-white light-mode:border-slate-300">
            <h3 className="font-display font-bold text-base text-slate-100 light-mode:text-slate-800 mb-1">Report Fuel Availability</h3>
            <p className="text-[11px] text-slate-400 light-mode:text-slate-500 mb-4">
              Updating: {fuelData?.stations?.find(s => s.id === reportingStationId)?.name}
            </p>

            {submitSuccess ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <CheckCircle className="h-12 w-12 text-emerald-400 animate-bounce mb-3" />
                <span className="text-sm font-semibold text-slate-200 light-mode:text-slate-800">Thank You!</span>
                <span className="text-[11px] text-slate-400 mt-1">Your crowdsourced report was successfully logged.</span>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">Fuel Type</label>
                  <select
                    value={selectedFuelType}
                    onChange={(e) => setSelectedFuelType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 dark:bg-slate-950 border border-slate-800 light-mode:bg-slate-100 light-mode:border-slate-300 light-mode:text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="p92">92 Octane Petrol</option>
                    <option value="p95">95 Octane Petrol</option>
                    <option value="autoD">Auto Diesel</option>
                    <option value="superD">Super Diesel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">Availability Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Available', label: 'Available', color: 'border-emerald-500 text-emerald-400' },
                      { id: 'Low Stock', label: 'Low Stock', color: 'border-amber-500 text-amber-400' },
                      { id: 'Out of Stock', label: 'Out of Stock', color: 'border-rose-500 text-rose-400' }
                    ].map(status => (
                      <button
                        key={status.id}
                        type="button"
                        onClick={() => setReportedStatus(status.id)}
                        className={`py-2 px-1 text-[10px] font-bold rounded-xl border text-center cursor-pointer transition-colors ${
                          reportedStatus === status.id
                            ? `bg-slate-800 ${status.color} border-2`
                            : 'border-slate-800 text-slate-400 hover:text-slate-350 light-mode:border-slate-200'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportingStationId(null)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700/80 cursor-pointer light-mode:bg-slate-100 light-mode:text-slate-700 light-mode:hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-teal-500 hover:bg-teal-600 text-white shadow-md shadow-teal-500/10 cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </MetricCard>
  );
}
