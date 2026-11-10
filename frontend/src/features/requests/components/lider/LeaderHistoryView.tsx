import React from 'react';
import {
  RotateCcw, Search, X, Calendar, ArrowDownLeft, ArrowUpRight,
  Filter, Package, Send, Camera, ChevronLeft, ChevronRight,
  AlertTriangle, ArrowRight, Loader2
} from 'lucide-react';
import {
  type MovementRecord, type MovementFilterType,
  toTitleCase, getDestinationSectorName, getTodayStr
} from './types';

export interface LeaderHistoryViewProps {
  paginatedMovements: MovementRecord[];
  totalFilteredCount: number;
  movementSearch: string;
  onMovementSearchChange: (value: string) => void;
  movementDate: string;
  onMovementDateChange: (value: string) => void;
  movementFilterType: MovementFilterType;
  onMovementFilterTypeChange: (type: MovementFilterType) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  sectorName?: string;
  dateFilteredCount: number;
  inCount: number;
  outCount: number;
  onViewPhotos: (photos: string[]) => void;
  loading: boolean;
}

export const LeaderHistoryView: React.FC<LeaderHistoryViewProps> = ({
  paginatedMovements, totalFilteredCount, movementSearch, onMovementSearchChange,
  movementDate, onMovementDateChange, movementFilterType, onMovementFilterTypeChange,
  currentPage, totalPages, onPageChange, onRefresh, sectorName,
  dateFilteredCount, inCount, outCount, onViewPhotos, loading
}) => {
  const today = getTodayStr();

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Topo do Histórico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy tracking-tight">Histórico de Movimentações</h2>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Rastro completo de ativos do setor {sectorName ? `(${toTitleCase(sectorName)})` : ''}.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium text-xs transition-all shadow-xs cursor-pointer active:scale-95"
          title="Atualizar lista"
        >
          <RotateCcw className="w-3.5 h-3.5 text-primary" />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por equipamento, empresa, responsável, setor ou observação..."
            value={movementSearch}
            onChange={(e) => onMovementSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all"
          />
          {movementSearch && (
            <button onClick={() => onMovementSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer" title="Limpar busca">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="relative flex items-center">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="date"
              value={movementDate}
              onChange={(e) => onMovementDateChange(e.target.value)}
              className="pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all cursor-pointer"
            />
            {movementDate && (
              <button onClick={() => onMovementDateChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer" title="Limpar data">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => onMovementDateChange(movementDate === today ? '' : today)}
            className={`px-3 py-2 border rounded-xl text-xs font-medium transition-all cursor-pointer ${movementDate === today ? 'bg-navy text-white border-navy font-semibold shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700'}`}
          >
            Hoje
          </button>
        </div>

        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 self-start md:self-auto overflow-x-auto w-full md:w-auto">
          <button onClick={() => onMovementFilterTypeChange('ALL')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${movementFilterType === 'ALL' ? 'bg-white text-navy font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
            Todas ({dateFilteredCount})
          </button>
          <button onClick={() => onMovementFilterTypeChange('IN')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${movementFilterType === 'IN' ? 'bg-emerald-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-emerald-700'}`}>
            <ArrowDownLeft className="w-3 h-3" /> <span>Entradas ({inCount})</span>
          </button>
          <button onClick={() => onMovementFilterTypeChange('OUT')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${movementFilterType === 'OUT' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-blue-700'}`}>
            <ArrowUpRight className="w-3 h-3" /> <span>Saídas ({outCount})</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center bg-white rounded-3xl border border-slate-100">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary opacity-20" />
          <p className="mt-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest italic">Carregando histórico...</p>
        </div>
      ) : totalFilteredCount === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center flex flex-col items-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-3"><Filter className="w-6 h-6" /></div>
          <h3 className="text-sm font-bold text-navy uppercase tracking-tight">Nenhuma movimentação encontrada</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">Nenhum registro corresponde aos filtros selecionados. Tente ajustar os parâmetros.</p>
          {(movementSearch || movementDate || movementFilterType !== 'ALL') && (
            <button onClick={() => { onMovementSearchChange(''); onMovementDateChange(''); onMovementFilterTypeChange('ALL'); }} className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer">
              Limpar Filtros
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/70 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3.5 text-xs font-semibold text-slate-500">Data / Hora</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-slate-500">Equipamento</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-slate-500">Origem → Destino</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-slate-500">Responsável</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 text-center">Evidência</th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 text-center">Visto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedMovements.map((move, i) => (
                  <tr key={move.id || i} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[11px] font-black text-navy uppercase">{new Date(move.moved_at).toLocaleDateString('pt-BR')}</p>
                      <p className="text-[9px] text-slate-400 font-bold">{new Date(move.moved_at).toLocaleTimeString('pt-BR')}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-black text-navy uppercase truncate">{move.material?.name}</p>
                          <p className="text-[9px] text-primary font-black uppercase tracking-widest truncate">{move.material?.request?.profile?.full_name}</p>
                          {(move.observation || move.material?.request?.rejection_reason) && (
                            <p className="text-[8px] text-amber-700 font-bold mt-1 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 max-w-[200px] truncate">
                              <AlertTriangle size={10} className="text-amber-600 shrink-0" />
                              <span className="truncate">{move.observation || move.material?.request?.rejection_reason}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-600 uppercase bg-slate-100 px-2 py-1 rounded-md max-w-[90px] truncate">{move.from_sector?.name || 'ENTRADA'}</span>
                        <Send className="w-3 h-3 text-slate-300 shrink-0" />
                        <span className="text-[9px] font-black text-primary uppercase bg-primary/10 px-2 py-1 rounded-md max-w-[90px] truncate">{getDestinationSectorName(move)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-navy text-white rounded-full flex items-center justify-center text-[9px] font-black shrink-0">
                          {move.actor?.full_name?.[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-navy uppercase truncate max-w-[120px]">{move.actor?.full_name}</span>
                          {move.actor?.registration_number && (
                            <span className="text-[9px] font-bold text-slate-400 mt-0.5">{move.actor.registration_number}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {move.photos && move.photos.length > 0 ? (
                        <button onClick={() => onViewPhotos(move.photos!)} className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all inline-flex items-center gap-1.5 cursor-pointer">
                          <Camera className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-black">{move.photos.length}</span>
                        </button>
                      ) : <span className="text-[9px] text-slate-300 font-black italic">N/A</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-slate-100 text-navy text-[9px] font-black px-2 py-1 rounded border border-slate-200 min-w-[32px] inline-block max-w-[80px] truncate">
                        {move.signature?.startsWith('data:image/') ? <img src={move.signature} alt="Visto" className="h-5 object-contain mx-auto" /> : move.signature || '--'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile List */}
          <div className="md:hidden divide-y divide-slate-50">
            {paginatedMovements.map((move, i) => (
              <div key={move.id || i} className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-navy uppercase truncate">{move.material?.name}</p>
                    <p className="text-[9px] text-primary font-black uppercase tracking-widest mt-0.5 truncate">{move.material?.request?.profile?.full_name}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-[10px] font-black text-navy leading-none mb-0.5">{new Date(move.moved_at).toLocaleDateString('pt-BR')}</p>
                    <p className="text-[8px] text-slate-400 font-bold">{new Date(move.moved_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
                  <span className="text-[9px] font-black text-slate-500 uppercase truncate">{move.from_sector?.name || 'ENTRADA'}</span>
                  <ArrowRight size={10} className="text-slate-300 shrink-0" />
                  <span className="text-[9px] font-black text-primary uppercase truncate">{getDestinationSectorName(move)}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-navy text-white rounded-full flex items-center justify-center text-[8px] font-black shrink-0">{move.actor?.full_name?.[0]}</div>
                    <span className="text-[10px] font-bold text-navy truncate max-w-[110px]">{move.actor?.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {move.photos && move.photos.length > 0 && (
                      <button onClick={() => onViewPhotos(move.photos!)} className="p-1.5 bg-primary/10 text-primary rounded-lg flex items-center gap-1 cursor-pointer">
                        <Camera size={13} />
                        <span className="text-[9px] font-black">{move.photos.length}</span>
                      </button>
                    )}
                    <span className="text-[9px] text-slate-400 font-mono">{move.signature ? 'Visto' : '--'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer">
                <ChevronLeft size={16} />
              </button>
              <p className="text-[10px] font-black text-navy uppercase tracking-widest">Página {currentPage} de {totalPages}</p>
              <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
