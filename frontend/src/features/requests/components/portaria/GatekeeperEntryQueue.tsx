import React from 'react';
import {
  AlertTriangle, Calendar, Camera, CheckCircle, ChevronRight, Clock, Eye,
  Hash, Info, Loader2, MapPin, Package, RotateCcw, Search, ShieldAlert,
  Truck, Users, X, XOctagon
} from 'lucide-react';
import { formatDateTime } from './types';
import type { CompanyDetails, GateStatus, Material, Requisicao } from './types';

export interface GatekeeperEntryQueueProps {
  selectedReq: Requisicao;
  processing: boolean;
  selectedMaterials: string[];
  onToggleMaterial: (id: string) => void;
  onSetSelectedMaterials: (ids: string[]) => void;
  photos: string[];
  onOpenCamera: () => void;
  onCapturePhoto: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (index: number) => void;
  observation: string;
  onObservationChange: (value: string) => void;
  signature: string;
  onSignatureChange: (value: string) => void;
  onUpdateGateStatus: (targetId: string, status: GateStatus) => void;
  onConfirmMovement: () => void;
  onOpenDiscrepancyModal: () => void;
  onCancelEntry: () => void;
  onBackToList: () => void;
  onSelectCompany: (company: CompanyDetails) => void;
  onViewPhotos: (photos: string[]) => void;
  onSelectMaterialDetail: (material: Material) => void;
}

const InfoItem = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">{icon}</div>
    <div><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{label}</p><p className="text-xs font-black text-navy uppercase">{value}</p></div>
  </div>
);

export const GatekeeperEntryQueue: React.FC<GatekeeperEntryQueueProps> = ({
  selectedReq, processing, selectedMaterials, onToggleMaterial, onSetSelectedMaterials, photos, onOpenCamera, onCapturePhoto,
  onRemovePhoto, observation, onObservationChange, signature, onSignatureChange, onUpdateGateStatus, onConfirmMovement,
  onOpenDiscrepancyModal, onCancelEntry, onBackToList, onSelectCompany, onViewPhotos, onSelectMaterialDetail
}) => {
  const visibleMaterials = selectedReq.materials.filter(m => m.status !== 'IN_PLANTA');
  const isWaiting = ['APPROVED_LIDER', 'APPROVED_GESTOR', 'APPROVED', 'WAITING_ARRIVAL'].includes(selectedReq.status);
  const canConfirm = ['IN_ANALYSIS', 'DISCREPANCY'].includes(selectedReq.status);

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

      {/* Stepper e Controles de Entrada */}
      <div className="bg-slate-50/70 border-b border-slate-200/80 p-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">Fluxo de Entrada na Usina</p>
            <div className="flex items-center gap-2">
              {selectedReq.status === 'ARRIVED' && (
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                  <Truck className="w-3.5 h-3.5 text-indigo-600" /> Veículo no Portão (Chegada)
                </span>
              )}
              {canConfirm && (
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                  <Search className="w-3.5 h-3.5 text-amber-600" /> Em Análise de Entrada
                </span>
              )}
              {isWaiting && (
                <span className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-sky-600" /> Aguardando Chegada no Portão
                </span>
              )}
              {selectedReq.status === 'IN_PLANTA' && (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Em Planta Industrial
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isWaiting && (
              <button onClick={() => onUpdateGateStatus(selectedReq.id, 'ARRIVED')} disabled={processing} className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer">
                <Truck className="w-3.5 h-3.5" /> Registrar Chegada
              </button>
            )}
            {selectedReq.status === 'ARRIVED' && (
              <>
                <button onClick={() => onUpdateGateStatus(selectedReq.id, 'IN_ANALYSIS')} disabled={processing} className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer">
                  <Search className="w-3.5 h-3.5" /> Iniciar Análise
                </button>
                <button onClick={() => onUpdateGateStatus(selectedReq.id, 'WAITING_ARRIVAL')} disabled={processing} className="px-3 py-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs" title="Voltar para Aguardando Chegada">
                  <RotateCcw className="w-3 h-3" /> Desfazer
                </button>
              </>
            )}
            {canConfirm && (
              <button onClick={() => onUpdateGateStatus(selectedReq.id, 'ARRIVED')} disabled={processing} className="px-3.5 py-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs" title="Voltar para Chegada">
                <RotateCcw className="w-3 h-3" /> Voltar p/ Chegada
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
          <div className="p-2.5 rounded-xl border bg-white border-slate-200 text-slate-800 font-semibold shadow-xs flex flex-col gap-1">
            <div className="flex items-center justify-between"><span className="text-[10px] font-medium text-slate-400">Passo 1</span><Clock className="w-3.5 h-3.5 text-sky-600" /></div>
            <p className="text-xs font-semibold leading-tight">Aguardando Chegada</p>
          </div>
          <div className={`p-2.5 rounded-xl border flex flex-col gap-1 transition-all ${['ARRIVED', 'IN_ANALYSIS', 'DISCREPANCY', 'IN_PLANTA'].includes(selectedReq.status) ? 'bg-white border-slate-200 text-slate-800 font-semibold shadow-xs' : 'bg-slate-50/50 border-slate-100 text-slate-400'}`}>
            <div className="flex items-center justify-between"><span className="text-[10px] font-medium text-slate-400">Passo 2</span><Truck className="w-3.5 h-3.5 text-indigo-600" /></div>
            <p className="text-xs font-semibold leading-tight">Chegada no Portão</p>
          </div>
          <div className={`p-2.5 rounded-xl border flex flex-col gap-1 transition-all ${['IN_ANALYSIS', 'DISCREPANCY', 'IN_PLANTA'].includes(selectedReq.status) ? 'bg-amber-50/60 border-amber-200 text-amber-900 font-semibold shadow-xs' : 'bg-slate-50/50 border-slate-100 text-slate-400'}`}>
            <div className="flex items-center justify-between"><span className="text-[10px] font-medium text-amber-700">Passo 3</span><Search className="w-3.5 h-3.5 text-amber-600" /></div>
            <p className="text-xs font-semibold leading-tight">Em Análise</p>
          </div>
          <div className={`p-2.5 rounded-xl border flex flex-col gap-1 transition-all ${selectedReq.status === 'IN_PLANTA' ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 font-semibold shadow-xs' : 'bg-slate-50/50 border-slate-100 text-slate-400'}`}>
            <div className="flex items-center justify-between"><span className="text-[10px] font-medium text-slate-400">Passo 4</span><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /></div>
            <p className="text-xs font-semibold leading-tight">Em Planta</p>
          </div>
        </div>
      </div>

      {(selectedReq.status === 'DISCREPANCY' || Boolean(selectedReq.rejection_reason || selectedReq.reason)) && (
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
            <p className="text-xs font-semibold text-slate-700">Itens para Conferência ({selectedMaterials.length}/{visibleMaterials.length})</p>
            <button
              onClick={() => {
                const allIds = visibleMaterials.map(m => m.id);
                onSetSelectedMaterials(selectedMaterials.length === allIds.length ? [] : allIds);
              }}
              className="text-xs font-medium text-primary hover:underline"
            >
              {selectedMaterials.length === visibleMaterials.length ? 'Desmarcar Todos' : 'Marcar Todos'}
            </button>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            {visibleMaterials.map(item => {
              const isSelected = selectedMaterials.includes(item.id);
              const itemPhotos = item.photos && item.photos.length > 0 ? item.photos : item.image_url ? [item.image_url] : [];
              return (
                <button
                  key={item.id}
                  onClick={() => onToggleMaterial(item.id)}
                  className={`w-full group p-3.5 rounded-xl border transition-all flex items-center justify-between text-left ${isSelected ? 'bg-primary/[0.04] border-primary/30 shadow-xs' : 'bg-white border-slate-200/80 hover:border-slate-300'}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all shrink-0 ${isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200/70'}`}>
                      {isSelected ? <CheckCircle className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 leading-tight truncate group-hover:text-primary transition-colors">{item.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{item.brand} {item.model}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-medium">Nº Série</p>
                      <p className={`text-xs font-mono font-medium ${isSelected ? 'text-primary' : 'text-slate-600'}`}>
                        {item.serial_number ? (item.serial_number.length > 12 ? `${item.serial_number.slice(0, 12)}...` : item.serial_number) : 'N/A'}
                      </p>
                    </div>
                    {itemPhotos.length > 0 && (
                      <button type="button" onClick={e => { e.stopPropagation(); onViewPhotos(itemPhotos); }} className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-1 cursor-pointer" title="Visualizar fotos do item">
                        <Camera className="w-3.5 h-3.5" /><span className="text-[10px] font-bold">{itemPhotos.length}</span>
                      </button>
                    )}
                    <button onClick={e => { e.stopPropagation(); onSelectMaterialDetail(item); }} className="p-1.5 bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-100 transition-all" title="Visualizar Detalhes">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fotos e Observação */}
      <div className="px-6 md:px-8 pb-6">
        <div className="bg-slate-50/60 rounded-xl border border-slate-200/80 p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Camera className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs font-semibold text-slate-800">Fotos da Operação</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Fotos do veículo, placa, caçamba, equipamentos ou inspeção</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={onOpenCamera} className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-hover transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
                <Camera className="w-3.5 h-3.5" /> Câmera
              </button>
              <label className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 cursor-pointer transition-all flex items-center gap-1.5 shadow-xs">
                <Package className="w-3.5 h-3.5" /> Galeria
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={onCapturePhoto} />
              </label>
            </div>
          </div>
          {photos.length > 0 && (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mb-4">
              {photos.map((p, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-slate-200 shadow-xs relative group/photo">
                  <img src={p} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => onRemovePhoto(i)} className="absolute top-1.5 right-1.5 p-1 bg-rose-500 text-white rounded-md opacity-0 group-hover/photo:opacity-100 transition-all hover:scale-110 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="group">
            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Observação / Estado do Veículo e Equipamento</label>
            <textarea
              placeholder="Descreva o estado do veículo/equipamento (ex: veículo com amassado no para-choque, placa conferida, caçamba limpa)..."
              value={observation}
              onChange={e => onObservationChange(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-xs min-h-[72px] custom-scrollbar"
            />
          </div>
        </div>
      </div>

      {/* Matrícula e Botões */}
      <div className="px-6 md:px-8 pb-5">
        <div className="bg-slate-50/60 rounded-xl border border-slate-200/80 p-5 md:p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-lg"><Hash className="w-4 h-4" /></div>
            <div>
              <p className="text-xs font-semibold text-slate-800">Matrícula de Confirmação</p>
              <p className="text-[11px] text-slate-500">Digite seu código de matrícula cadastrado para validar no banco</p>
            </div>
          </div>
          <input
            type="text"
            placeholder="Digite o código da sua matrícula..."
            value={signature}
            onChange={e => onSignatureChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-xs tracking-wider uppercase shadow-xs"
          />
        </div>
      </div>

      {!canConfirm && (
        <div className="px-6 md:px-8 pb-3">
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-center gap-2.5 text-amber-800 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Para liberar a entrada ou registrar divergência, inicie a etapa <strong>Em Análise</strong> acima.</span>
          </div>
        </div>
      )}

      <div className="p-6 md:px-8 md:py-6 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onConfirmMovement}
          disabled={processing || selectedMaterials.length === 0 || !signature || !canConfirm}
          className="flex-[3] py-3.5 px-6 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs bg-primary text-white hover:bg-primary-hover"
          title={!canConfirm ? 'Disponível apenas quando a solicitação estiver Em Análise' : ''}
        >
          {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Liberar Entrada ({selectedMaterials.length})</>}
        </button>
        <button
          onClick={onOpenDiscrepancyModal}
          disabled={processing || selectedReq.status === 'DISCREPANCY' || selectedReq.status !== 'IN_ANALYSIS'}
          className="flex-1 py-3 px-4 bg-white text-rose-700 border border-rose-200 hover:bg-rose-50/70 disabled:opacity-40 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs disabled:cursor-not-allowed"
          title={selectedReq.status === 'DISCREPANCY' ? 'Divergência já registrada nesta solicitação' : selectedReq.status !== 'IN_ANALYSIS' ? 'Disponível apenas quando a solicitação estiver Em Análise' : ''}
        >
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          {selectedReq.status === 'DISCREPANCY' ? 'Divergência Registrada' : 'Divergência'}
        </button>
      </div>

      <div className="px-6 md:px-8 pb-6 flex">
        <button
          onClick={onCancelEntry}
          disabled={processing}
          className="flex-1 py-2.5 bg-white text-rose-600 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 disabled:opacity-40 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs"
        >
          <XOctagon className="w-4 h-4" />
          {selectedReq.status === 'DISCREPANCY' ? 'Cancelar / Recusar Entrada (Divergência)' : 'Não Compareceu / Cancelar Entrada'}
        </button>
      </div>
    </div>
  );
};
