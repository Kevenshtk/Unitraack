import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

export interface LeaderRejectReasonModalProps {
  isOpen: boolean;
  targetId: string | null;
  isProcessing: boolean;
  onClose: () => void;
  onConfirmReject: (requestId: string, reason: string) => Promise<void> | void;
}

export const LeaderRejectReasonModal: React.FC<LeaderRejectReasonModalProps> = ({
  isOpen,
  targetId,
  isProcessing,
  onClose,
  onConfirmReject
}) => {
  const [reason, setReason] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setHasError(false);
    }
  }, [isOpen]);

  if (!isOpen || !targetId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setHasError(true);
      return;
    }
    onConfirmReject(targetId, reason.trim());
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-navy/70 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 cursor-default"
      >
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy leading-tight">
                  Recusar Solicitação
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Informe o motivo da recusa desta solicitação de entrada.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="p-2 bg-slate-50 text-slate-400 hover:text-navy rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              title="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Motivo da Recusa <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (hasError && e.target.value.trim()) setHasError(false);
                }}
                disabled={isProcessing}
                placeholder="Descreva detalhadamente o motivo da recusa (ex: documentação incompleta, itens não autorizados, setor divergente)..."
                className={`w-full p-3.5 bg-slate-50 border rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all resize-none ${
                  hasError
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : 'border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary'
                }`}
              />
              {hasError && (
                <p className="text-[11px] text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                  O preenchimento da justificativa é obrigatório para recusa.
                </p>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-snug">
                Esta justificativa será registrada no histórico e informada ao solicitante terceirizado e à portaria.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 py-3 px-4 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <span>Confirmar Recusa</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

