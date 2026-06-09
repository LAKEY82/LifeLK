import { Phone, LifeBuoy, ShieldAlert, Zap, Droplet, Users } from 'lucide-react';
import MetricCard from './MetricCard';

const EMERGENCY_CONTACTS = [
  { name: 'Suwa Seriya Ambulance', number: '1990', desc: 'Free emergency medical responder service.', icon: LifeBuoy, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
  { name: 'Police Emergency', number: '119', desc: 'National police intervention hot-line.', icon: ShieldAlert, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
  { name: 'Fire & Rescue Colombo', number: '110', desc: 'Municipal fire department dispatch.', icon: ShieldAlert, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { name: 'Child Protection Authority', number: '1929', desc: 'Reporting child abuse and welfare concerns.', icon: Users, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { name: 'Ceylon Electricity Board', number: '1987', desc: 'Power failure reporting and breakdowns.', icon: Zap, color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' },
  { name: 'Water Board Helpline', number: '1939', desc: 'Water service disruptions & leak reporting.', icon: Droplet, color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' }
];

export default function EmergencyWidget() {
  return (
    <MetricCard
      title="Emergency Hotlines"
      icon={Phone}
      className="col-span-1 md:col-span-1 lg:col-span-1"
    >
      <div className="flex flex-col h-full gap-3 justify-between">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
          Sri Lankan Critical Helpline Contacts
        </span>

        {/* Helpline grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 overflow-y-auto max-h-[250px] pr-1">
          {EMERGENCY_CONTACTS.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-900/30 dark:bg-slate-900/40 border border-slate-900/50 dark:border-slate-850/40 light-mode:bg-slate-50 light-mode:border-slate-200/80 hover:border-rose-500/10 transition-colors flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-8.5 w-8.5 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}>
                    <IconComponent className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col min-w-0 pr-1">
                    <span className="font-bold text-slate-200 light-mode:text-slate-800 text-[11px] truncate">{item.name}</span>
                    <span className="text-[9px] text-slate-400 light-mode:text-slate-500 mt-0.5 leading-tight">{item.desc}</span>
                  </div>
                </div>

                <a
                  href={`tel:${item.number}`}
                  className="px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 group-hover:scale-103 transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
                >
                  <Phone className="h-3 w-3 shrink-0" />
                  {item.number}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </MetricCard>
  );
}
