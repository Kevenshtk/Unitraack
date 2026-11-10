import React, { useMemo } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  X,
  Package,
  Eye,
  Camera,
  History,
  AlertTriangle,
  Send,
  Loader2
} from 'lucide-react';
import {
  type Material,
  type MovementRecord,
  toTitleCase
} from './types';

export interface LeaderMovementsViewProps {
  materials: Material[];
  currentSectorId?: string;
  currentSectorName?: string;
  isProcessing?: boolean;
  onAcceptClick: (materialId: string, materialName: string) => void;
  onRejectTransferClick: (materialId: string) => void;
  onCancelTransferClick: (materialId: string) => void;
  onSelectMaterial: (material: Material) => void;
  onViewPhotos?: (photos: string[]) => void;
}

export const LeaderMovementsView: React.FC<LeaderMovementsViewProps> = ({
  materials,
  currentSectorId,
  currentSectorName,
  isProcessing,
  onAcceptClick,
  onRejectTransferClick,
  onCancelTransferClick,
  onSelectMaterial,
  onViewPhotos
}) => {
  const movingMaterials = useMemo(() => {
    return materials.filter((m) => m.status === 'MOVING');
  }, [materials]);

  const incomingMaterials = useMemo(() => {
    return movingMaterials.filter((m) => {
      if (currentSectorId && m.pending_sector_id === currentSectorId) return true;
      const destName = (m.request?.sector || '').trim().toLowerCase();
      return Boolean(currentSectorName && destName && (destName === currentSectorName || destName.includes(currentSectorName)));
    });
  }, [movingMaterials, currentSectorId, currentSectorName]);

  const outgoingMaterials = useMemo(() => {
    return movingMaterials.filter((m) => !incomingMaterials.includes(m));
  }, [movingMaterials, incomingMaterials]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Topo informativo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy tracking-tight">
            Transferências em Trânsito
          </h2>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Gerencie os equipamentos em processo de movimentação entre setores.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2">
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-700">Chegando:</span>
            <span className="text-xs font-bold text-navy bg-emerald-50 px-2 py-0.5 rounded-md text-emerald-700">
              {incomingMaterials.length}
            </span>
          </div>
          <div className="bg-white px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-slate-700">Enviados:</span>
            <span className="text-xs font-bold text-navy bg-amber-50 px-2 py-0.5 rounded-md text-amber-700">
              {outgoingMaterials.length}
            </span>
          </div>
        </div>
      </div>

      {movingMaterials.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="bg-slate-50 p-5 rounded-full mb-4">
            <Send className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-navy font-bold text-base uppercase tracking-tight">
            Nenhuma Transferência Ativa
          </h3>
          <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
            Não há equipamentos em trânsito para recebimento ou envio pelo seu setor no momento.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Seção 1: Chegando ao Setor (Recebimento) */}
          {incomingMaterials.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-navy uppercase tracking-wider">
                  Aguardando Seu Aceite ({incomingMaterials.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {incomingMaterials.map((mat) => (
                  <MovingItemCard
                    key={mat.id}
                    mat={mat}
                    mode="incoming"
                    isProcessing={isProcessing}
                    onAccept={() => onAcceptClick(mat.id, mat.name)}
                    onReject={() => onRejectTransferClick(mat.id)}
                    onViewDetails={() => onSelectMaterial(mat)}
                    onViewPhotos={onViewPhotos}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Seção 2: Saindo do Setor (Enviados) */}
          {outgoingMaterials.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 rounded-lg text-amber-700">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-navy uppercase tracking-wider">
                  Enviados para Outro Setor ({outgoingMaterials.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {outgoingMaterials.map((mat) => (
                  <MovingItemCard
                    key={mat.id}
                    mat={mat}
                    mode="outgoing"
                    isProcessing={isProcessing}
                    onCancel={() => onCancelTransferClick(mat.id)}
                    onViewDetails={() => onSelectMaterial(mat)}
                    onViewPhotos={onViewPhotos}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface MovingItemCardProps {
  mat: Material;
  mode: 'incoming' | 'outgoing';
  isProcessing?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  onViewDetails: () => void;
  onViewPhotos?: (photos: string[]) => void;
}

const MovingItemCard: React.FC<MovingItemCardProps> = ({
  mat,
  mode,
  isProcessing,
  onAccept,
  onReject,
  onCancel,
  onViewDetails,
  onViewPhotos
}) => {
  const movements: MovementRecord[] = mat.movements || [];
  const movementsCount = movements.length;
  const totalPhotos = movements.reduce((acc: number, m: any) => acc + (m.photos?.length || 0), 0);
  const latestMovement = movements[0];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all relative overflow-hidden flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors flex items-center justify-center shrink-0">
              <Package size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-navy text-sm leading-snug truncate">
                {toTitleCase(mat.name)}
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{mat.serial_number || mat.code || 'S/ Serial'}</p>
            </div>
          </div>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
            mode === 'incoming'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
              : 'bg-amber-50 text-amber-700 border-amber-200/80'
          }`}>
            {mode === 'incoming' ? 'Chegando' : 'Saindo'}
          </span>
        </div>

        <div className="bg-slate-50/70 rounded-xl p-3 mb-3 border border-slate-100 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[11px] text-slate-400 font-medium">Proprietário</span>
            <span className="font-medium text-navy truncate max-w-[150px]">{toTitleCase(mat.request?.profile?.full_name) || '---'}</span>
          </div>
          <div className="h-px bg-slate-100 w-full"></div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[11px] text-slate-400 font-medium">Condição</span>
            <span className="font-medium text-primary uppercase">{mat.condition || 'BOM'}</span>
          </div>
        </div>

        {movementsCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 flex items-center gap-1">
              <History size={11} className="text-primary" /> {movementsCount} {movementsCount === 1 ? 'passagem' : 'passagens'}
            </span>
            {totalPhotos > 0 && (
              <button
                type="button"
                onClick={() => {
                  const allPhotos = movements.flatMap((m: any) => m.photos || []).filter(Boolean);
                  if (allPhotos.length > 0 && onViewPhotos) onViewPhotos(allPhotos);
                  else onViewDetails();
                }}
                className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200/70 hover:bg-cyan-100 flex items-center gap-1 transition-all cursor-pointer"
              >
                <Camera size={11} /> {totalPhotos} {totalPhotos === 1 ? 'foto' : 'fotos'}
              </button>
            )}
          </div>
        )}

        {latestMovement?.observation && (
          <div className="bg-slate-50/80 rounded-xl p-2.5 mb-3 border border-slate-100">
            <p className="text-[10px] text-slate-400 mb-0.5 font-medium">Observação do Envio:</p>
            <p className="text-xs text-navy italic line-clamp-2">"{latestMovement.observation}"</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-50">
        {mode === 'incoming' ? (
          <>
            <button
              onClick={onAccept}
              disabled={isProcessing}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-medium text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" /> <span>Aceitar</span>
            </button>
            <button
              onClick={onReject}
              disabled={isProcessing}
              className="flex-1 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 active:scale-95 font-medium text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <X className="w-4 h-4" /> <span>Recusar</span>
            </button>
            <button
              onClick={onViewDetails}
              className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/40 rounded-xl flex items-center justify-center transition-all cursor-pointer"
              title="Ver detalhes"
            >
              <Eye size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-medium text-xs py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer group/cancel disabled:opacity-50"
            >
              <X className="w-4 h-4 group-hover/cancel:scale-110 transition-transform" /> <span>Cancelar Envio</span>
            </button>
            <button
              onClick={onViewDetails}
              className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/40 rounded-xl flex items-center justify-center transition-all cursor-pointer"
              title="Ver detalhes"
            >
              <Eye size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

