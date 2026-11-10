import React from 'react';
import {
  Search,
  Package,
  ArrowRight,
  LogOut,
  X,
  Check,
  Eye,
  History,
  Camera,
  ClipboardList,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { type Material, type MovementRecord, toTitleCase } from './types';

export interface LeaderSectorInventoryViewProps {
  materials: Material[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedForTransfer: string[];
  onToggleSelectMaterial: (id: string) => void;
  onClearSelection: () => void;
  onOpenTransferModal: () => void;
  onOpenExitModal: () => void;
  onAcceptClick: (materialId: string, materialName: string) => void;
  onRejectTransferClick: (materialId: string) => void;
  onCancelTransferClick: (materialId: string) => void;
  onSelectMaterial: (material: Material) => void;
  onViewPhotos?: (photos: string[]) => void;
  currentSectorId?: string;
  loading: boolean;
}

export const LeaderSectorInventoryView: React.FC<LeaderSectorInventoryViewProps> = ({
  materials, searchTerm, onSearchChange, selectedForTransfer,
  onToggleSelectMaterial, onClearSelection, onOpenTransferModal, onOpenExitModal,
  onAcceptClick, onRejectTransferClick, onCancelTransferClick, onSelectMaterial,
  onViewPhotos, currentSectorId, loading
}) => {
  return (
    <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-navy tracking-tight">Equipamentos no Setor</h2>
          <p className="text-xs text-slate-500 font-normal mt-0.5">Gerencie os ativos atualmente sob sua responsabilidade.</p>
          <div className="mt-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
              <input
                type="text"
                placeholder="Buscar por nome ou serial..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white border border-slate-200 py-2.5 pl-11 pr-4 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {selectedForTransfer.length > 0 && (
          <div className="bg-navy p-1.5 rounded-2xl flex items-center justify-between gap-2 shadow-lg shadow-navy/20 animate-in zoom-in slide-in-from-right-4 duration-200 w-full md:w-auto mt-4 md:mt-0 flex-wrap md:flex-nowrap">
            <div className="px-3 py-1 flex-1 md:flex-none">
              <p className="text-[9px] font-medium text-white/50 leading-none mb-1">Selecionados</p>
              <p className="text-base font-bold text-white leading-none">{selectedForTransfer.length}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
              <button
                onClick={onOpenTransferModal}
                className="bg-primary hover:bg-[#00928a] text-white px-3.5 py-2 rounded-xl font-medium text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                title="Transferir para outro setor interno"
              >
                <span>Transferir Setor</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={onOpenExitModal}
                className="bg-rose-500 hover:bg-rose-600 text-white px-3.5 py-2 rounded-xl font-medium text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                title="Dar baixa e enviar para saída na portaria"
              >
                <LogOut size={13} />
                <span>Dar Saída</span>
              </button>
              <button
                onClick={onClearSelection}
                className="h-8 w-8 flex items-center justify-center rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Limpar seleção"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-20 text-center bg-white rounded-3xl border border-slate-100">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary opacity-20" />
          <p className="mt-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest italic">Processando inventário do setor...</p>
        </div>
      ) : materials.length === 0 ? (
        <div className="p-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="bg-slate-50 p-6 rounded-full mb-6"><Package className="w-12 h-12 text-slate-300" /></div>
          <h3 className="text-navy font-bold text-lg uppercase tracking-tight">Setor Vazio</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">Nenhum material encontrado com os filtros atuais.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {materials.map((mat) => (
            <SectorMaterialCard
              key={mat.id}
              mat={mat}
              isSelected={selectedForTransfer.includes(mat.id)}
              onSelect={() => onToggleSelectMaterial(mat.id)}
              onAccept={() => onAcceptClick(mat.id, mat.name)}
              onReject={() => onRejectTransferClick(mat.id)}
              onCancelTransfer={() => onCancelTransferClick(mat.id)}
              onViewDetails={() => onSelectMaterial(mat)}
              onViewPhotos={onViewPhotos}
              currentSectorId={currentSectorId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface SectorMaterialCardProps {
  mat: Material;
  isSelected: boolean;
  onSelect: () => void;
  onAccept: () => void;
  onReject: () => void;
  onCancelTransfer: () => void;
  onViewDetails: () => void;
  onViewPhotos?: (photos: string[]) => void;
  currentSectorId?: string;
}

const SectorMaterialCard: React.FC<SectorMaterialCardProps> = ({
  mat, isSelected, onSelect, onAccept, onReject, onCancelTransfer, onViewDetails, onViewPhotos, currentSectorId
}) => {
  const isMoving = mat.status === 'MOVING';
  const isIncoming = isMoving && mat.pending_sector_id === currentSectorId;
  const isOutgoing = isMoving && !isIncoming;
  const hasDiscrepancy = mat.request?.status === 'DISCREPANCY' || Boolean(mat.request?.rejection_reason || mat.request?.reason);
  const discrepancyNote = mat.request?.rejection_reason || mat.request?.reason;

  const movements: MovementRecord[] = mat.movements || [];
  const movementsCount = movements.length;
  const totalPhotos = movements.reduce((acc: number, m: any) => acc + (m.photos?.length || 0), 0);
  const latestMovementWithObs = [...movements].reverse().find((m: any) => m.observation?.trim());
  const latestObs = latestMovementWithObs?.observation;

  return (
    <div
      className={`bg-white rounded-2xl p-5 border transition-all relative overflow-hidden group ${
        isSelected
          ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
          : 'border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${isSelected ? 'bg-primary text-white shadow-xs' : 'bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
            <Package size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-navy text-sm leading-snug group-hover:text-primary transition-colors">{toTitleCase(mat.name)}</h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{mat.serial_number || mat.code || 'S/ Serial'}</p>
          </div>
        </div>
        {(isMoving || mat.status === 'WAITING_EXIT') && (
          <div className="shrink-0 flex items-center gap-1.5">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border shadow-xs ${mat.status === 'MOVING' ? 'bg-amber-50 text-amber-700 border-amber-200/80' : 'bg-rose-50 text-rose-700 border-rose-200/80'}`}>
              {mat.status === 'MOVING' ? (isIncoming ? 'Chegando' : 'Saindo') : 'Aguardando Saída'}
            </span>
          </div>
        )}
      </div>

      <div className="bg-slate-50/70 rounded-xl p-3 mb-3 border border-slate-100 space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[11px] text-slate-400 font-medium">Proprietário</span>
          <span className="font-medium text-navy truncate max-w-[160px]">{toTitleCase(mat.request?.profile?.full_name) || '---'}</span>
        </div>
        <div className="h-px bg-slate-100 w-full"></div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-[11px] text-slate-400 font-medium">Condição</span>
          <span className="font-medium text-primary uppercase">{mat.condition || 'BOM'}</span>
        </div>
      </div>

      {movementsCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 flex items-center gap-1">
            <History size={11} className="text-primary" /> {movementsCount} {movementsCount === 1 ? 'passagem' : 'passagens'}
          </span>
          {totalPhotos > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const allPhotos = movements.flatMap((m: any) => m.photos || []).filter(Boolean);
                if (allPhotos.length > 0 && onViewPhotos) onViewPhotos(allPhotos);
                else onViewDetails();
              }}
              className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200/70 hover:bg-cyan-100 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              title="Ver fotos tiradas nas passagens"
            >
              <Camera size={11} className="text-cyan-600" /> {totalPhotos} {totalPhotos === 1 ? 'foto' : 'fotos'}
            </button>
          )}
        </div>
      )}

      {latestObs && (
        <div className="bg-slate-50/80 rounded-xl p-2.5 mb-3 border border-slate-100">
          <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mb-0.5"><ClipboardList size={10} className="text-primary" /> Último Estado Registrado:</p>
          <p className="text-xs text-navy font-normal italic line-clamp-2 leading-relaxed">"{latestObs}"</p>
        </div>
      )}

      {hasDiscrepancy && (
        <div className="bg-amber-50/70 rounded-xl p-3 mb-3 border border-amber-200/70 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-amber-900">Atenção: Remessa com Divergência</p>
            <p className="text-xs text-amber-800 font-normal leading-snug mt-0.5 line-clamp-2">{discrepancyNote || 'Divergência registrada na conferência da portaria.'}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {isIncoming ? (
          <>
            <button onClick={onAccept} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs py-2.5 rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
              <Check className="w-4 h-4" /> <span>Aceitar</span>
            </button>
            <button onClick={onReject} className="flex-1 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-medium text-xs py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
              <X className="w-4 h-4" /> <span>Recusar</span>
            </button>
          </>
        ) : isOutgoing ? (
          <>
            <button onClick={onCancelTransfer} className="flex-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-medium text-xs py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer group/cancel">
              <X className="w-4 h-4 group-hover/cancel:scale-110 transition-transform" /> <span>Cancelar Envio</span>
            </button>
            <button onClick={onViewDetails} className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/40 rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer" title="Ver detalhes">
              <Eye size={16} />
            </button>
          </>
        ) : (
          <>
            <button onClick={onSelect} className={`flex-1 font-medium text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${isSelected ? 'bg-navy text-white shadow-navy/20' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              {isSelected ? <><Check size={14} /> <span>Selecionado</span></> : 'Selecionar'}
            </button>
            <button onClick={onViewDetails} className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/40 rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer" title="Ver detalhes">
              <Eye size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
