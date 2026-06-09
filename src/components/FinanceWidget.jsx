import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calculator, RefreshCw } from 'lucide-react';
import { fetchExchangeRates, fetchCrypto } from '../services/api';
import MetricCard from './MetricCard';

export default function FinanceWidget() {
  const [exchangeData, setExchangeData] = useState(null);
  const [cryptoData, setCryptoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculator state
  const [usdAmount, setUsdAmount] = useState('1');
  const [lkrAmount, setLkrAmount] = useState('');
  const [activeInput, setActiveInput] = useState('usd'); // 'usd' or 'lkr'

  const loadFinancialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [exRate, crypto] = await Promise.all([
        fetchExchangeRates(),
        fetchCrypto()
      ]);
      setExchangeData(exRate);
      setCryptoData(crypto);

      // Initialize calculator
      if (exRate && exRate.rate) {
        setLkrAmount((1 * exRate.rate).toFixed(2));
      }
    } catch (err) {
      setError('Unable to load currency or crypto data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialData();
  }, []);

  // Update converter values
  const handleUsdChange = (val) => {
    setUsdAmount(val);
    setActiveInput('usd');
    if (!exchangeData || isNaN(val)) return;
    setLkrAmount((parseFloat(val || 0) * exchangeData.rate).toFixed(2));
  };

  const handleLkrChange = (val) => {
    setLkrAmount(val);
    setActiveInput('lkr');
    if (!exchangeData || isNaN(val)) return;
    setUsdAmount((parseFloat(val || 0) / exchangeData.rate).toFixed(4));
  };

  // Format crypto prices
  const formatLkrPrice = (price) => {
    if (price >= 1000000) return `${(price / 1000000).toFixed(2)}M`;
    return price.toLocaleString();
  };

  return (
    <MetricCard
      title="Exchange Rates & Crypto"
      icon={TrendingUp}
      loading={loading}
      error={error}
      onRetry={loadFinancialData}
    >
      <div className="flex flex-col h-full gap-4 justify-between">
        {/* LKR Exchange rate card */}
        {exchangeData && (
          <div className="p-3.5 rounded-2xl bg-slate-900/30 border border-slate-850/40 light-mode:bg-slate-50 light-mode:border-slate-200/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <DollarSign className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">USD to LKR Rate</span>
                <span className="text-base font-extrabold text-slate-100 light-mode:text-slate-800">
                  LKR {exchangeData.rate.toFixed(2)}
                </span>
              </div>
            </div>
            <span className="text-[8px] text-slate-500 font-bold bg-slate-900/60 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-850/20">
              Source: {exchangeData.provider}
            </span>
          </div>
        )}

        {/* Currency Calculator */}
        {exchangeData && (
          <div className="p-3 rounded-2xl bg-slate-900/20 dark:bg-slate-900/40 border border-slate-900/40 dark:border-slate-850/40 light-mode:bg-slate-100/50 light-mode:border-slate-200/50 flex flex-col gap-2">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold flex items-center gap-1.5">
              <Calculator className="h-3.5 w-3.5" />
              Quick LKR Converter
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 mb-1 font-bold uppercase">USD Amount</span>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                  <input
                    type="number"
                    value={usdAmount}
                    onChange={(e) => handleUsdChange(e.target.value)}
                    className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-slate-950/60 dark:bg-slate-950 border border-slate-850 light-mode:bg-white light-mode:border-slate-250 light-mode:text-slate-800 focus:outline-none text-xs font-bold"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 mb-1 font-bold uppercase">LKR equivalent</span>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rs.</span>
                  <input
                    type="number"
                    value={lkrAmount}
                    onChange={(e) => handleLkrChange(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-slate-950/60 dark:bg-slate-950 border border-slate-850 light-mode:bg-white light-mode:border-slate-250 light-mode:text-slate-800 focus:outline-none text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Crypto list */}
        <div className="flex-1 flex flex-col gap-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Live Crypto Tracker</span>
          <div className="grid grid-cols-2 gap-2">
            {cryptoData &&
              Object.entries(cryptoData).map(([name, prices]) => (
                <div
                  key={name}
                  className="p-2.5 rounded-xl bg-slate-900/20 dark:bg-slate-900/40 border border-slate-900/40 dark:border-slate-850/40 light-mode:bg-slate-50 light-mode:border-slate-200/50 flex flex-col justify-between hover:border-teal-500/10 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-200 light-mode:text-slate-700 capitalize">
                      {name === 'binancecoin' ? 'BNB' : name}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold flex items-center ${
                        prices.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {prices.change >= 0 ? '+' : ''}
                      {prices.change?.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex flex-col mt-1">
                    <span className="text-xs font-extrabold text-slate-100 light-mode:text-slate-800">
                      Rs. {formatLkrPrice(prices.lkr)}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-0.5">
                      ${prices.usd.toLocaleString()} USD
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </MetricCard>
  );
}
