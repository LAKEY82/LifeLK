import { AlertCircle, RefreshCw } from 'lucide-react';

export default function MetricCard({
  title,
  icon: Icon,
  loading = false,
  error = null,
  onRetry = null,
  className = '',
  actionButton = null,
  children
}) {
  return (
    <div className={`glass-panel p-6 flex flex-col relative overflow-hidden h-full ${className}`}>
      {/* Premium accent border on hover */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-teal-500/30 via-emerald-400/30 to-amber-500/30" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-900/20 dark:border-slate-800/60 light-mode:border-slate-200/60">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="h-5 w-5 text-teal-400 light-mode:text-teal-600" />}
          <h3 className="font-display font-semibold text-lg tracking-wide text-slate-100 light-mode:text-slate-800">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {actionButton}
          {onRetry && !loading && (
            <button
              onClick={onRetry}
              className="p-1.5 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-800/40 light-mode:text-slate-500 light-mode:hover:text-teal-600 light-mode:hover:bg-slate-100 transition-colors cursor-pointer"
              title="Refresh widget data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col relative">
        {loading ? (
          <div className="flex-1 flex flex-col justify-center items-center py-12 space-y-4">
            <div className="h-8 w-8 rounded-full border-3 border-teal-500/20 border-t-teal-500 animate-spin" />
            <div className="space-y-2 w-full text-center">
              <div className="h-3.5 bg-slate-800/50 light-mode:bg-slate-200 rounded w-2/3 mx-auto animate-pulse" />
              <div className="h-3 bg-slate-800/50 light-mode:bg-slate-200 rounded w-1/2 mx-auto animate-pulse" />
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col justify-center items-center py-8 text-center">
            <AlertCircle className="h-10 w-10 text-rose-500 dark:text-rose-400 mb-3 animate-[bounce_1.5s_infinite]" />
            <p className="text-sm text-slate-400 light-mode:text-slate-600 mb-4 px-2">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 light-mode:bg-rose-50 light-mode:text-rose-600 light-mode:hover:bg-rose-100 transition-all cursor-pointer"
              >
                Retry Connection
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col animate-fade-in">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
