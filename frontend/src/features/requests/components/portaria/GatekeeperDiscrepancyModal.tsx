import React from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';

export interface GatekeeperDiscrepancyModalProps {
  isOpen: boolean;
  discrepancyReason: string;
  processing: boolean;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const GatekeeperDiscrepancyModal: React.FC<GatekeeperDiscrepancyModalProps> = ({
  isOpen,
  discrepancyReason,
  processing,
  onReasonChange,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 border border-slate-200 cursor-default"
      >
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="p-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">Notificar Divergência</h3>
              <p className="text-slate-500 font-normal text-xs">Alerta encaminhado ao Gestor de Segurança</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-slate-700 mb-2">Qual a irregularidade identificada?</label>
            <textarea
              value={discrepancyReason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Ex: Material extra não listado, equipamento danificado, foto não confere..."
              className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-xs font-normal text-slate-800 resize-none"
            ></textarea>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-slate-600 font-medium text-xs hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={!discrepancyReason || processing}
              className="flex-[2] py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              {processing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Enviar Alerta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

