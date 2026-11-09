import React from 'react';
import { AlertTriangle, Camera, CheckCircle, Info, Package, X } from 'lucide-react';
import type { CompanyDetails, Material, ModalConfig } from './types';
import { formatDateTime } from './types';

export interface GatekeeperModalsProps {
  detailMaterial: Material | null;
  onCloseMaterialDetail: () => void;
  selectedCompany: CompanyDetails | null;
  onCloseCompany: () => void;
  auditHistory: any[];
  showSuccessModal: boolean;
  modalConfig: ModalConfig;
  onCloseSuccessModal: () => void;
  selectedPhotos: string[] | null;
  onSelectPhotos: (photos: string[] | null) => void;
}

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
    <p className="font-bold text-navy text-sm">{value}</p>
  </div>
);

export const GatekeeperModals: React.FC<GatekeeperModalsProps> = ({
  detailMaterial,
  onCloseMaterialDetail,
  selectedCompany,
  onCloseCompany,
  auditHistory,
  showSuccessModal,
  modalConfig,
  onCloseSuccessModal,
  selectedPhotos,
  onSelectPhotos,
}) => {
  return (
    <>
      {/* Material Detail Modal */}
      {detailMaterial && (
        <div
          onClick={onCloseMaterialDetail}
          className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-2xl max-h-[90vh] my-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-150 cursor-default border border-slate-200"
          >
            <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center shrink-0 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0"><Package className="w-5 h-5" /></div>
                <div className="min-w-0">
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider leading-none">Equipamento</p>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate mt-0.5">{detailMaterial.name}</h2>
                </div>
              </div>
              <button onClick={onCloseMaterialDetail} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all shrink-0 cursor-pointer ml-2" title="Fechar">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
              <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 h-48 sm:h-64 flex items-center justify-center relative shadow-inner">
                {detailMaterial.image_url ? (
                  <img src={detailMaterial.image_url} alt={detailMaterial.name} className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 p-4">
                    <Camera className="w-12 h-12 mb-2 opacity-40" />
                    <p className="font-medium text-xs text-slate-400">Sem Foto Disponivel</p>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-xs">Visualizacao Tecnica</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <DetailItem label="Marca" value={detailMaterial.brand || '---'} />
                <DetailItem label="Modelo" value={detailMaterial.model || '---'} />
                <DetailItem label="Nº de Série" value={detailMaterial.serial_number || 'REGISTRO ÚNICO'} />
                <DetailItem label="Condição" value={detailMaterial.condition || 'USADO'} />
              </div>

              {detailMaterial.description && (
                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-medium mb-1 uppercase tracking-wider">Descricao Adicional</p>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed whitespace-pre-wrap">{detailMaterial.description}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
              <button onClick={onCloseMaterialDetail} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-all text-xs shadow-xs active:scale-[0.99] cursor-pointer">
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company Detail Modal */}
      {selectedCompany && (
        <div
          onClick={onCloseCompany}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 border border-slate-200 flex flex-col md:flex-row max-h-[85vh] cursor-default"
          >
            <div className="p-6 md:p-8 md:w-1/2 border-r border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xs" style={{ backgroundColor: selectedCompany.theme_color || '#0032A0' }}>
                    {selectedCompany.logo_url ? <img src={selectedCompany.logo_url} alt="" className="w-full h-full object-cover rounded-xl" /> : selectedCompany.full_name[0]}
                  </div>
                  <button onClick={onCloseCompany} className="p-2 bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-all md:hidden">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <span className="text-xs font-semibold text-primary">Perfil da Empresa</span>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug mt-0.5">{selectedCompany.full_name}</h3>
                </div>

                <div className="space-y-4">
                  <DetailItem label="Representante" value={selectedCompany.representative_name || 'NÃO INFORMADO'} />
                  <DetailItem label="CNPJ" value={selectedCompany.cnpj || 'NÃO INFORMADO'} />
                  <DetailItem label="Telefone" value={selectedCompany.phone || 'NÃO INFORMADO'} />
                </div>
              </div>

              <button onClick={onCloseCompany} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-3 rounded-xl mt-6 transition-all shadow-xs cursor-pointer">
                Fechar Detalhes
              </button>
            </div>

            <div className="p-6 md:p-8 md:w-1/2 bg-slate-50 flex flex-col overflow-hidden">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-700">Histórico de Movimentações</h4>
                <span className="bg-white text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full border border-slate-200">{auditHistory.length} registros</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {auditHistory.length === 0 ? (
                  <div className="bg-white rounded-xl p-6 text-center border border-slate-100 shadow-xs">
                    <Info className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Sem movimentações registradas</p>
                  </div>
                ) : (
                  auditHistory.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-200/80 group hover:border-primary/30 transition-all">
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{item.material.name}</p>
                          <p className="text-[11px] text-slate-500">{item.from_sector?.name || 'ENTRADA'} → {item.to_sector?.name || 'SAÍDA'}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {formatDateTime(item.moved_at).date} {formatDateTime(item.moved_at).time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-600">{item.actor?.full_name?.[0]}</div>
                          <p className="text-[11px] text-slate-600">
                            Por: <span className="font-medium text-slate-800">{item.actor?.full_name}</span>
                            {item.signature &&
                              (item.signature.startsWith('data:image/') ? (
                                <span className="ml-1.5 inline-block bg-white border border-slate-200 rounded p-0.5 align-middle">
                                  <img src={item.signature} alt="Visto" className="h-3.5 object-contain" />
                                </span>
                              ) : (
                                <span className="ml-1 text-primary">[{item.signature}]</span>
                              ))}
                          </p>
                        </div>

                        {item.photos && item.photos.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPhotos(item.photos ?? null);
                            }}
                            className="p-1 bg-primary/10 text-primary rounded-md hover:bg-primary hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Camera className="w-3 h-3" /><span className="text-[10px] font-bold">{item.photos.length}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Modal */}
      {showSuccessModal && (
        <div
          onClick={onCloseSuccessModal}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 border border-slate-200 cursor-default"
          >
            <div className="p-6 md:p-8 text-center">
              <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-xs ${modalConfig.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                {modalConfig.type === 'success' ? <CheckCircle className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{modalConfig.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">{modalConfig.message}</p>

              <button
                onClick={onCloseSuccessModal}
                className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all active:scale-95 shadow-xs cursor-pointer ${modalConfig.type === 'success' ? 'bg-primary text-white hover:bg-primary-hover' : 'bg-rose-600 text-white hover:bg-rose-700'}`}
              >
                Prosseguir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {selectedPhotos && (
        <div
          onClick={() => onSelectPhotos(null)}
          className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-navy/95 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-6xl h-full flex flex-col cursor-default">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary rounded-2xl text-white"><Camera className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Evidências Fotográficas</h3>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Protocolo de Portaria • {selectedPhotos.length} Fotos</p>
                </div>
              </div>
              <button onClick={() => onSelectPhotos(null)} className="p-4 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 rounded-2xl transition-all">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                {selectedPhotos.map((p, i) => (
                  <div key={i} className="group relative aspect-video bg-navy-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                    <img src={p} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
                      <p className="text-[9px] font-black text-white uppercase tracking-widest">Evidência #{i + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
