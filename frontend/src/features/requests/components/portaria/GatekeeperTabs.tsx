import React from 'react';
import { AlertTriangle, ChevronRight, ClipboardList, Clock, Loader2, Search, Truck } from 'lucide-react';
import type { ActiveTab, EntrySubFilter, ExitSubFilter, Requisicao } from './types';

export interface GatekeeperTabsProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  entrySubFilter: EntrySubFilter;
  onEntrySubFilterChange: (filter: EntrySubFilter) => void;
  exitSubFilter: ExitSubFilter;
  onExitSubFilterChange: (filter: ExitSubFilter) => void;
  requisicoes: Requisicao[];
  filteredReqs: Requisicao[];
  loading: boolean;
  selecionadoId: string | null;
  onSelectRequest: (id: string) => void;
  hiddenOnMobile: boolean;
}

export const GatekeeperTabs: React.FC<GatekeeperTabsProps> = ({
  activeTab, onSelectTab, searchTerm, onSearchChange,
  entrySubFilter, onEntrySubFilterChange, exitSubFilter, onExitSubFilterChange,
  requisicoes, filteredReqs, loading, selecionadoId, onSelectRequest, hiddenOnMobile
}) => {
  return (
    <div className={`lg:col-span-4 space-y-4 sticky top-24 ${hiddenOnMobile ? 'hidden lg:block' : ''}`}>
      <div className="bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/80 shadow-xs flex gap-1.5">
        <button onClick={() => onSelectTab('ENTRY')} className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${activeTab === 'ENTRY' ? 'bg-white text-navy font-semibold shadow-xs border border-slate-200/70' : 'text-slate-500 hover:text-slate-800'}`}>
          Entrada na Planta
        </button>
        <button onClick={() => onSelectTab('EXIT')} className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${activeTab === 'EXIT' ? 'bg-white text-navy font-semibold shadow-xs border border-slate-200/70' : 'text-slate-500 hover:text-slate-800'}`}>
          Saída da Planta
        </button>
        <button onClick={() => onSelectTab('IN_PLANTA')} className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${activeTab === 'IN_PLANTA' ? 'bg-white text-navy font-semibold shadow-xs border border-slate-200/70' : 'text-slate-500 hover:text-slate-800'}`}>
          Em Planta
        </button>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Buscar por empresa, placa ou protocolo..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-normal text-xs text-slate-800 placeholder:text-slate-400"
        />
      </div>

      {activeTab === 'ENTRY' && (
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100/70 border border-slate-200/80 rounded-xl">
          <button
            onClick={() => onEntrySubFilterChange('WAITING')}
            className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              entrySubFilter === 'WAITING'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Aguardando</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                entrySubFilter === 'WAITING'
                  ? 'bg-sky-100 text-sky-700'
                  : 'bg-slate-200/70 text-slate-500'
              }`}
            >
              {
                requisicoes.filter(r =>
                  ['APPROVED_LIDER', 'APPROVED_GESTOR', 'APPROVED', 'WAITING_ARRIVAL'].includes(
                    r.status
                  )
                ).length
              }
            </span>
          </button>
          <button
            onClick={() => onEntrySubFilterChange('ARRIVED')}
            className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              entrySubFilter === 'ARRIVED'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Chegada</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                entrySubFilter === 'ARRIVED'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-200/70 text-slate-500'
              }`}
            >
              {requisicoes.filter(r => r.status === 'ARRIVED').length}
            </span>
          </button>
          <button
            onClick={() => onEntrySubFilterChange('ANALYSIS')}
            className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              entrySubFilter === 'ANALYSIS'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Em Análise</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                entrySubFilter === 'ANALYSIS'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-200/70 text-slate-500'
              }`}
            >
              {requisicoes.filter(r => r.status === 'IN_ANALYSIS' || r.status === 'DISCREPANCY').length}
            </span>
          </button>
        </div>
      )}

      {activeTab === 'EXIT' && (
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/70 border border-slate-200/80 rounded-xl">
          <button
            onClick={() => onExitSubFilterChange('WAITING')}
            className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              exitSubFilter === 'WAITING'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Aguardando Saída</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                exitSubFilter === 'WAITING'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-200/70 text-slate-500'
              }`}
            >
              {
                requisicoes.filter(
                  r =>
                    r.status === 'WAITING_EXIT' ||
                    r.materials?.some(m => m.status === 'WAITING_EXIT')
                ).length
              }
            </span>
          </button>
          <button
            onClick={() => onExitSubFilterChange('CONFERENCE')}
            className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              exitSubFilter === 'CONFERENCE'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Conferência</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                exitSubFilter === 'CONFERENCE'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-slate-200/70 text-slate-500'
              }`}
            >
              {
                requisicoes.filter(
                  r =>
                    r.status === 'EXIT_CONFERENCE' ||
                    r.materials?.some(m => m.status === 'EXIT_CONFERENCE')
                ).length
              }
            </span>
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col min-h-[500px]">
        <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-2 h-2 rounded-full ${
                activeTab === 'ENTRY'
                  ? 'bg-emerald-500'
                  : activeTab === 'EXIT'
                  ? 'bg-rose-500'
                  : 'bg-blue-500'
              }`}
            ></div>
            <span className="text-xs font-semibold text-slate-700">
              {activeTab === 'ENTRY'
                ? 'Fila de Triagem'
                : activeTab === 'EXIT'
                ? 'Veículos Aguardando Saída'
                : 'Veículos em Planta'}
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-600 px-2.5 py-0.5 bg-white border border-slate-200 rounded-full shadow-xs">
            {filteredReqs.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-50">
          {loading ? (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Sincronizando Banco...
              </p>
            </div>
          ) : filteredReqs.length === 0 ? (
            <div className="p-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <Truck className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest leading-relaxed">
                Nenhum registro
                <br />
                identificado na fila
              </p>
            </div>
          ) : (
            filteredReqs.map(req => (
              <button
                key={req.id}
                onClick={() => onSelectRequest(req.id)}
                className={`w-full p-4 text-left transition-all hover:bg-slate-50/80 flex items-center justify-between group relative overflow-hidden ${
                  selecionadoId === req.id ? 'bg-primary/[0.04]' : ''
                }`}
              >
                {selecionadoId === req.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                )}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs relative shrink-0"
                    style={{ backgroundColor: req.profile?.theme_color || '#0032A0' }}
                  >
                    {req.profile.logo_url ? (
                      <img src={req.profile.logo_url} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      req.profile.full_name[0]
                    )}

                    {(req.status === 'DISCREPANCY' || Boolean(req.rejection_reason || req.reason)) && (
                      <div
                        className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1 border-2 border-white shadow-xs"
                        title="Remessa com divergência / observação"
                      >
                        <AlertTriangle className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 text-xs truncate mb-0.5">
                      {req.profile.full_name}
                    </p>
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-500">
                      <span className="truncate">{req.sector}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-medium text-primary shrink-0">#{req.id.slice(0, 8)}</span>
                    </div>
                    {activeTab === 'ENTRY' && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {req.status === 'DISCREPANCY' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-2.5 h-2.5 text-rose-600" /> Divergência
                          </span>
                        )}
                        {req.status === 'ARRIVED' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Truck className="w-2.5 h-2.5" /> Chegada
                          </span>
                        )}
                        {req.status === 'IN_ANALYSIS' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <Search className="w-2.5 h-2.5" /> Em Análise
                          </span>
                        )}
                        {['APPROVED_LIDER', 'APPROVED_GESTOR', 'APPROVED', 'WAITING_ARRIVAL'].includes(
                          req.status
                        ) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                            <Clock className="w-2.5 h-2.5" /> Aguardando Chegada
                          </span>
                        )}
                      </div>
                    )}
                    {activeTab === 'IN_PLANTA' && (
                      <div>
                        {(req.status === 'DISCREPANCY' ||
                          Boolean(req.rejection_reason || req.reason)) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-2.5 h-2.5 text-amber-600" /> Com Divergência
                          </span>
                        )}
                      </div>
                    )}
                    {activeTab === 'EXIT' && (
                      <div>
                        {req.status === 'EXIT_CONFERENCE' ||
                        req.materials?.some(m => m.status === 'EXIT_CONFERENCE') ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            <ClipboardList className="w-2.5 h-2.5" /> Conferência
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-2.5 h-2.5" /> Aguardando Saída
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-slate-300 transition-transform shrink-0 ${
                    selecionadoId === req.id ? 'translate-x-0.5 text-primary' : ''
                  }`}
                />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
