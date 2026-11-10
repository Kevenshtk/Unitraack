import React from 'react';
import {
  X,
  Package,
  History,
  Camera,
  AlertTriangle,
  Clock,
  User,
  FileText,
  ArrowRight,
  Eye
} from 'lucide-react';
import {
  type CompanyDetails,
  type Material,
  type MovementRecord
} from './types';

export interface LeaderModalsProps {
  selectedCompany: CompanyDetails | null;
  onCloseCompany: () => void;
  selectedMaterial: Material | null;
  onCloseMaterial: () => void;
  selectedPhotos: string[] | null;
  onClosePhotos: () => void;
  onViewPhotos?: (photos: string[]) => void;
}

export const LeaderModals: React.FC<LeaderModalsProps> = ({
  selectedCompany,
  onCloseCompany,
  selectedMaterial,
  onCloseMaterial,
  selectedPhotos,
  onClosePhotos,
  onViewPhotos
}) => {
  return (
    <>
      {selectedCompany && (
        <CompanyModal company={selectedCompany} onClose={onCloseCompany} />
      )}
      {selectedMaterial && (
        <MaterialModal
          material={selectedMaterial}
          onClose={onCloseMaterial}
          onViewPhotos={onViewPhotos}
        />
      )}
      {selectedPhotos && (
        <PhotoModal photos={selectedPhotos} onClose={onClosePhotos} />
      )}
    </>
  );
};

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1.5">{label}</p>
      <p className="text-navy font-bold text-xs uppercase">{value}</p>
    </div>
  );
}

function CompanyModal({ company, onClose }: { company: CompanyDetails; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-navy/70 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 cursor-default"
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl overflow-hidden"
              style={{ backgroundColor: company.theme_color || '#0032A0' }}
            >
              {company.logo_url ? <img src={company.logo_url} alt="" className="w-full h-full object-cover" /> : company.full_name[0]}
            </div>
            <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 hover:text-navy rounded-xl cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <h3 className="text-xl font-bold text-navy uppercase leading-tight mb-6">{company.full_name}</h3>
          <div className="space-y-4">
            <DetailItem label="Representante" value={company.representative_name || '---'} />
            <DetailItem label="CNPJ" value={company.cnpj || '---'} />
            <DetailItem label="Telefone" value={company.phone || '---'} />
          </div>
          <button onClick={onClose} className="w-full bg-navy text-white font-bold text-xs uppercase py-3.5 rounded-xl mt-8 cursor-pointer active:scale-95 transition-all">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function MaterialModal({ material, onClose, onViewPhotos }: { material: Material; onClose: () => void; onViewPhotos?: (photos: string[]) => void }) {
  const movements: MovementRecord[] = [...(material.movements || [])].sort(
    (a, b) => new Date(b.moved_at).getTime() - new Date(a.moved_at).getTime()
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 md:p-6 bg-navy/80 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col cursor-default animate-in zoom-in-95 duration-200 my-auto"
      >
        <div className="bg-navy p-5 md:p-8 relative overflow-hidden shrink-0">
          <div className="relative z-10 flex justify-between items-start text-white">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 md:w-14 md:h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                <Package className="w-5 h-5 md:w-7 md:h-7 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-primary/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-primary/30">
                    {material.condition || 'BOM'}
                  </span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                    material.status === 'IN_PLANTA' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                    material.status === 'MOVING' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    'bg-white/10 text-white/70 border-white/10'
                  }`}>
                    {material.status === 'MOVING' ? 'Em Trânsito' : material.status === 'IN_PLANTA' ? 'Em Planta' : material.status}
                  </span>
                </div>
                <h3 className="font-black uppercase text-base md:text-2xl tracking-tighter leading-tight truncate text-white">
                  {material.name}
                </h3>
              </div>
            </div>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-all border border-white/10 text-white/60 hover:text-white cursor-pointer ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 h-48 md:min-h-[190px] flex items-center justify-center">
              {material.image_url ? (
                <img src={material.image_url} alt={material.name} className="w-full h-full object-contain p-2" />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-300 p-6 text-center">
                  <Package size={40} className="mb-2 opacity-50" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sem Foto Inicial</span>
                </div>
              )}
            </div>

            <div className="md:col-span-2 bg-slate-50/70 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Nº de Série" value={material.serial_number || 'Não informado'} />
                <DetailItem label="Código Patrimônio" value={material.code || '---'} />
                <DetailItem label="Fabricante / Marca" value={material.brand || '---'} />
                <DetailItem label="Modelo" value={material.model || '---'} />
                <DetailItem label="Empresa Proprietária" value={material.request?.profile?.full_name || '---'} />
                <DetailItem label="Data de Entrada" value={material.entry_at ? new Date(material.entry_at).toLocaleDateString('pt-BR') : '---'} />
              </div>
              {material.description && (
                <div className="mt-3 pt-3 border-t border-slate-200/60">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Descrição</p>
                  <p className="text-xs text-navy italic">"{material.description}"</p>
                </div>
              )}
            </div>
          </div>

          {(material.request?.rejection_reason || material.request?.reason || material.request?.status === 'DISCREPANCY') && (
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Divergência / Observação</p>
                <p className="text-xs text-amber-900 font-bold mt-1">
                  {material.request?.rejection_reason || material.request?.reason || 'Divergência apontada durante a inspeção física.'}
                </p>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History size={16} className="text-primary" />
                <h4 className="font-black text-navy uppercase text-xs tracking-wider">Histórico de Passagens & Evidências ({movements.length})</h4>
              </div>
            </div>

            {movements.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-2xl text-center">Nenhuma transferência de setor registrada ainda.</p>
            ) : (
              <div className="space-y-3">
                {movements.map((move, idx) => (
                  <div key={move.id || idx} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-navy text-xs uppercase">{move.from_sector?.name || 'Entrada'}</span>
                        <ArrowRight size={12} className="text-primary" />
                        <span className="font-bold text-primary text-xs uppercase">{move.to_sector?.name || 'Setor Destino'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <Clock size={11} className="text-primary" /> {new Date(move.moved_at).toLocaleDateString('pt-BR')} às {new Date(move.moved_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        <span>•</span>
                        <User size={11} className="text-primary" /> {move.actor?.full_name || 'Responsável'}
                      </div>
                    </div>
                    {move.observation && (
                      <p className="text-xs text-navy mt-2 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">"{move.observation}"</p>
                    )}
                    {move.photos && move.photos.length > 0 && (
                      <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                        {move.photos.map((url, pIdx) => (
                          <button key={pIdx} type="button" onClick={() => onViewPhotos && onViewPhotos(move.photos!)} className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 hover:border-primary cursor-pointer">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button onClick={onClose} className="px-6 bg-navy text-white font-bold text-xs uppercase py-3 rounded-xl cursor-pointer active:scale-95">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function PhotoModal({ photos, onClose }: { photos: string[]; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-8 bg-navy/95 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-6xl h-full flex flex-col cursor-default">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary rounded-xl text-white">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase">Evidências Fotográficas</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase">{photos.length} Fotos Registradas</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {photos.map((p, i) => (
              <div key={i} className="aspect-video bg-navy-900 rounded-2xl overflow-hidden border border-white/5 shadow-xl relative group">
                <img src={p} alt={`Evidência ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                  <p className="text-[10px] font-bold text-white uppercase">Evidência #{i + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

