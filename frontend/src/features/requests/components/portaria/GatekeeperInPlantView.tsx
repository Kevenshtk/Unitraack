import React from 'react';
import {
  AlertTriangle, Calendar, Camera, CheckCircle, ChevronRight, Clock,
  Eye, Hash, Info, MapPin, Package, Users,
} from 'lucide-react';
import type { Requisicao, Material, CompanyDetails } from './types';
import { formatDateTime } from './types';

export interface GatekeeperInPlantViewProps {
  selectedReq: Requisicao;
  onBackToList: () => void;
  onSelectCompany: (company: CompanyDetails) => void;
  onViewPhotos: (photos: string[]) => void;
  onSelectMaterialDetail: (material: Material) => void;
}

const InfoItem = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">{icon}</div>
    <div>
      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-black text-navy uppercase">{value}</p>
    </div>
  </div>
);

export const GatekeeperInPlantView: React.FC<GatekeeperInPlantViewProps> = ({
  selectedReq,
  onBackToList,
  onSelectCompany,
  onViewPhotos,
  onSelectMaterialDetail,
}) => {
  const visibleMaterials = selectedReq.materials.filter((m) => m.status === 'IN_PLANTA');
  const hasDiscrepancy = selectedReq.status === 'DISCREPANCY' || Boolean(selectedReq.rejection_reason || selectedReq.reason);

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start gap-6 relative">
        <button onClick={onBackToList} className="md:hidden flex items-center gap-1.5 text-slate-500 font-medium text-xs mb-2">
          <ChevronRight className="w-4 h-4 rotate-180" /> Voltar para Lista
        </button>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xs relative overflow-hidden group/logo"
            style={{ backgroundColor: selectedReq.profile.theme_color || '#0032A0' }}
          >
            {selectedReq.profile.logo_url ? <img src={selectedReq.profile.logo_url} alt="" className="w-full h-full object-cover" /> : selectedReq.profile.full_name[0]}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => onSelectCompany(selectedReq.profile)}>
              <Info className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-tight">{selectedReq.profile.full_name}</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Destino: <span className="font-medium text-slate-700">{selectedReq.sector}</span> • Protocolo #{selectedReq.id.slice(0, 8)}
            </p>
          </div>
        </div>
      </div>

      {hasDiscrepancy && (
        <div className="bg-amber-50/70 border-b border-amber-200/80 px-6 md:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0"><AlertTriangle className="w-4 h-4" /></div>
            <div className="text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-950 text-xs">{selectedReq.status === 'DISCREPANCY' ? 'Divergência Registrada' : 'Remessa com Observação / Divergência'}</span>
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">Atenção Portaria</span>
              </div>
              <p className="text-amber-900 font-normal mt-0.5 leading-relaxed text-xs">
                {selectedReq.rejection_reason || selectedReq.reason || 'Divergência apontada durante a inspeção física dos equipamentos.'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-amber-800 bg-white px-2.5 py-1 rounded-lg shrink-0 border border-amber-200 shadow-xs">Gestor Notificado</span>
        </div>
      )}

      <div className="px-6 md:px-8 py-6 md:py-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-5 bg-slate-50/60 rounded-xl border border-slate-200/80 group hover:border-primary/30 transition-all">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-xs text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0"><MapPin className="w-5 h-5" /></div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 mb-0.5">Destino Designado</p>
              <p className="text-base font-bold text-slate-900 leading-tight">{selectedReq.sector}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Motorista" value={selectedReq.driver_name || 'NÃO INFORMADO'} icon={<Users className="w-4 h-4 text-slate-400" />} />
            <InfoItem label="Placa" value={selectedReq.plate || '---'} icon={<Hash className="w-4 h-4 text-slate-400" />} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Data Agendada" value={formatDateTime(selectedReq.entry_date).date} icon={<Calendar className="w-4 h-4 text-slate-400" />} />
            <InfoItem label="Horário" value={formatDateTime(selectedReq.entry_date).time} icon={<Clock className="w-4 h-4 text-slate-400" />} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-700">{`Equipamentos em Planta (${visibleMaterials.length})`}</p>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            {visibleMaterials.map((item) => {
              const itemPhotos = item.photos && item.photos.length > 0 ? item.photos : item.image_url ? [item.image_url] : [];
              return (
                <div key={item.id} className="w-full p-3.5 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between text-left">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600 shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 leading-tight truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{item.brand} {item.model}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-medium">Nº Série</p>
                      <p className="text-xs font-mono text-slate-600">{item.serial_number || 'N/A'}</p>
                    </div>

                    {itemPhotos.length > 0 && (
                      <button
                        type="button"
                        onClick={() => onViewPhotos(itemPhotos)}
                        className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                        title="Visualizar fotos do item"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">{itemPhotos.length}</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectMaterialDetail(item)}
                      className="p-1.5 bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                      title="Visualizar Detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`p-5 md:p-6 border-t flex items-center gap-3.5 ${hasDiscrepancy ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-50/60 border-slate-100'}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${hasDiscrepancy ? 'bg-amber-500 text-white shadow-xs' : 'bg-primary/10 text-primary'}`}>
          {hasDiscrepancy ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-800">
            {hasDiscrepancy
              ? 'Veículo e materiais em operação na planta (com divergência registrada)'
              : 'Veículo e materiais em operação na planta'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Destino designado: <span className="font-medium text-slate-700">{selectedReq.sector || 'Unidade Lins'}</span>. Nenhuma ação pendente na portaria.
          </p>
        </div>
      </div>
    </div>
  );
};

