import React, { useState, useEffect } from 'react';
import { Clock, History, LogOut } from 'lucide-react';
import { NotificationDropdown } from '../dashboard/NotificationDropdown';

export interface GatekeeperHeaderProps {
  tenant: any;
  userProfile: any;
  isHistoryPageOpen: boolean;
  onToggleHistory: () => void;
  onSignOut: () => void;
}

export const GatekeeperHeader: React.FC<GatekeeperHeaderProps> = ({
  tenant,
  userProfile,
  isHistoryPageOpen,
  onToggleHistory,
  onSignOut
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const logoUrl = tenant?.logo_url || userProfile?.tenant?.logo_url;
  const tenantName = tenant?.name || userProfile?.tenant?.name || 'Usina Lins';

  return (
    <nav className="h-16 bg-navy border-b border-white/10 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[60] shadow-sm select-none">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={tenantName}
              className="h-7 object-contain brightness-0 invert max-w-[150px]"
            />
          ) : (
            <span className="font-semibold text-white text-sm tracking-tight">{tenantName}</span>
          )}
          <div className="h-5 w-px bg-white/10 mx-1 hidden sm:block"></div>
          <div className="hidden sm:block">
            <h1 className="font-semibold text-white text-xs tracking-tight">Controle de Portaria</h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden lg:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-slate-300 font-mono">
            {currentTime.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </div>

        <div className="hidden sm:flex flex-col items-end border-l border-white/10 pl-4">
          <p className="text-xs font-medium text-white">
            {userProfile?.full_name || 'Agente de Portaria'}
          </p>
        </div>

        <NotificationDropdown />

        <button
          onClick={onToggleHistory}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-medium text-xs cursor-pointer ${
            isHistoryPageOpen
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white/10 text-white hover:bg-white/15'
          }`}
          title="Histórico de Portaria"
        >
          <History className="w-3.5 h-3.5" /> <span>Histórico</span>
        </button>

        <button
          onClick={onSignOut}
          className="p-2 text-white/50 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
          title="Sair do Sistema"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};

