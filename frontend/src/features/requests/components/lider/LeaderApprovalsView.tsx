import React from 'react';
import { Check, X, ClipboardList, AlertTriangle, Package, Loader2 } from 'lucide-react';
import type { Requisicao, CompanyDetails, Material } from './types';

export interface LeaderApprovalsViewProps {
  requisicoes: Requisicao[];
  loading: boolean;
  onApprove: (requestId: string) => void;
  onOpenRejectModal: (requestId: string) => void;
  onSelectCompany: (company: CompanyDetails) => void;
  onSelectMaterial: (material: Material) => void;
}

export const LeaderApprovalsView: React.FC<LeaderApprovalsViewProps> = ({
  requisicoes,
  loading,
  onApprove,
  onOpenRejectModal,
  onSelectCompany,
  onSelectMaterial
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy tracking-tight">
            Aprovações Pendentes
          </h2>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Valide as solicitações destinadas ao seu setor.
          </p>
        </div>
        <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between md:justify-start gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <ClipboardList className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-400 mb-0.5">Pendências</p>
              <p className="text-base font-bold text-navy leading-none">{requisicoes.length}</p>
            </div>
          </div>
          <div className="h-6 w-px bg-slate-100 hidden md:block"></div>
          <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            <span className="text-[10px] font-medium text-slate-500">Sincronizado</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center bg-white rounded-3xl border border-slate-100">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary opacity-20" />
          <p className="mt-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest italic">
            Processando fluxos de segurança...
          </p>
        </div>
      ) : requisicoes.length === 0 ? (
        <div className="p-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="bg-slate-50 p-6 rounded-full mb-6">
            <Check className="w-12 h-12 text-emerald-400" />
          </div>
          <h3 className="text-navy font-bold text-lg uppercase tracking-tight">Sem Pendências</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">Tudo em ordem no seu setor.</p>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {requisicoes.map((req) => (
            <RequestCard
              key={req.id}
              req={req}
              onApprove={() => onApprove(req.id)}
              onReject={() => onOpenRejectModal(req.id)}
              onSelectCompany={onSelectCompany}
              onSelectMaterial={onSelectMaterial}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface RequestCardProps {
  req: Requisicao;
  onApprove: () => void;
  onReject: () => void;
  onSelectCompany: (company: CompanyDetails) => void;
  onSelectMaterial: (material: Material) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({
  req,
  onApprove,
  onReject,
  onSelectCompany,
  onSelectMaterial
}) => {
  const safeEntryDate = !req.entry_date.includes('Z') && !req.entry_date.includes('+') && !req.entry_date.match(/-\d{2}:\d{2}$/)
    ? `${req.entry_date}Z`
    : req.entry_date;

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all group relative overflow-hidden">
      <div className="relative flex flex-col lg:flex-row gap-6 md:gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3.5 mb-5">
            <button
              onClick={() => onSelectCompany(req.profile)}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xs transition-all hover:scale-105 active:scale-95 overflow-hidden shrink-0 cursor-pointer"
              style={{ backgroundColor: req.profile?.theme_color || '#0032A0' }}
            >
              {req.profile?.logo_url ? (
                <img src={req.profile.logo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                req.profile?.full_name?.[0] || 'T'
              )}
            </button>
            <div className="flex-1 min-w-0">
              <button
                onClick={() => onSelectCompany(req.profile)}
                className="text-base font-semibold text-navy hover:text-primary transition-colors text-left truncate block w-full cursor-pointer"
              >
                {req.profile?.full_name}
              </button>
              <div className="flex items-center gap-2 mt-0.5 overflow-hidden">
                <span className="text-[10px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-md">Terceirizada</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-400 font-normal">
                  {new Date(safeEntryDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
              <p className="text-xs text-slate-500 font-medium mb-0.5">Setor Destino</p>
              <p className="font-semibold text-navy text-xs truncate">{req.sector}</p>
            </div>
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
              <p className="text-xs text-slate-500 font-medium mb-0.5">Horário Previsto</p>
              <p className="font-semibold text-navy text-xs">
                {new Date(safeEntryDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {(req.rejection_reason || req.reason || req.status === 'DISCREPANCY') && (
            <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[9px] font-black text-amber-900 uppercase tracking-wider">Atenção: Remessa com Observação / Divergência</p>
                  <span className="text-[8px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">Portaria</span>
                </div>
                <p className="text-xs text-amber-900 font-semibold mt-1 leading-snug">
                  {req.rejection_reason || req.reason || 'Divergência apontada durante a conferência física.'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 lg:border-l lg:border-slate-50 lg:pl-10">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest">Itens ({req.materials.length})</p>
            <span className="text-[8px] font-black text-primary uppercase bg-primary/5 px-2 py-0.5 rounded-full">Clique para Ver</span>
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
            {req.materials.map((mat) => (
              <button
                key={mat.id}
                onClick={() => onSelectMaterial(mat)}
                className="w-full text-left bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 hover:border-primary/20 transition-all group/mat relative overflow-hidden cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover/mat:bg-primary/10 group-hover/mat:text-primary transition-colors">
                    <Package size={14} />
                  </div>
                  <div>
                    <p className="font-black text-navy text-[10px] md:text-[11px] uppercase group-hover/mat:text-primary transition-colors truncate max-w-[120px]">{mat.name}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{mat.serial_number || 'S/ Serial'}</p>
                  </div>
                </div>
                <span className="text-[8px] font-black text-primary uppercase bg-primary/5 px-2 py-0.5 rounded-full">{mat.condition}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex lg:flex-col gap-3 md:gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-50">
          <button
            onClick={onApprove}
            className="flex-1 lg:w-16 lg:h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center py-4 lg:py-0 transition-all active:scale-95 group/btn gap-2 lg:gap-0 cursor-pointer"
            title="Aprovar entrada"
          >
            <Check className="w-6 h-6 lg:w-8 lg:h-8 group-hover/btn:scale-110 transition-transform" />
            <span className="lg:hidden text-[10px] font-black uppercase tracking-widest">Aprovar</span>
          </button>
          <button
            onClick={onReject}
            className="flex-1 lg:w-16 lg:h-16 bg-white border border-slate-200 hover:border-rose-200 text-slate-300 hover:text-rose-500 rounded-2xl flex items-center justify-center py-4 lg:py-0 transition-all active:scale-95 gap-2 lg:gap-0 cursor-pointer"
            title="Recusar entrada"
          >
            <X className="w-6 h-6 lg:w-8 lg:h-8" />
            <span className="lg:hidden text-[10px] font-black uppercase tracking-widest">Recusar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

