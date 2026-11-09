import React, { createContext, useContext, useState, useCallback, useEffect, useId, useRef } from 'react';
import { AlertTriangle, HelpCircle, ShieldAlert, Loader2, X } from 'lucide-react';

export interface ConfirmInputConfig {
  type?: 'text' | 'textarea';
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  errorMessage?: string;
}

export interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  inputConfig?: ConfirmInputConfig;
}

export interface ConfirmResult {
  isConfirmed: boolean;
  value?: string;
}

export interface ConfirmDialogProps extends ConfirmOptions {
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: (value?: string) => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
  inputConfig,
  onConfirm,
  onCancel,
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const [inputValue, setInputValue] = useState(inputConfig?.defaultValue || '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue(inputConfig?.defaultValue || '');
      setValidationError(null);
      const timer = setTimeout(() => {
        if (inputConfig && inputRef.current) {
          inputRef.current.focus();
        } else if (confirmButtonRef.current) {
          confirmButtonRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, inputConfig]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  const handleConfirmClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (inputConfig) {
      const isRequired = inputConfig.required !== false;
      const trimmed = inputValue.trim();
      if (isRequired && !trimmed) {
        setValidationError(inputConfig.errorMessage || 'Este campo é obrigatório.');
        return;
      }
      onConfirm(trimmed);
      return;
    }

    onConfirm();
  };

  const variantStyles = {
    danger: {
      iconBg: 'bg-rose-50 border-rose-100 text-rose-600',
      button: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
      IconComponent: ShieldAlert,
    },
    warning: {
      iconBg: 'bg-amber-50 border-amber-100 text-amber-600',
      button: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20',
      IconComponent: AlertTriangle,
    },
    primary: {
      iconBg: 'bg-primary/10 border-primary/20 text-primary',
      button: 'bg-primary hover:bg-[#00928a] text-white shadow-primary/20',
      IconComponent: HelpCircle,
    },
  }[variant];

  const { IconComponent } = variantStyles;

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs animate-in fade-in duration-200 font-brand"
      onClick={() => !isLoading && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleConfirmClick} className="p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${variantStyles.iconBg}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="space-y-1 pt-0.5">
                <h3 id={titleId} className="text-base font-bold text-navy tracking-tight">
                  {title}
                </h3>
                <p id={descriptionId} className="text-xs text-slate-600 leading-relaxed font-normal">
                  {description}
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={isLoading}
              onClick={onCancel}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Fechar diálogo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {inputConfig && (
            <div className="space-y-1.5">
              {inputConfig.type === 'textarea' ? (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder={inputConfig.placeholder || ''}
                  rows={3}
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              ) : (
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder={inputConfig.placeholder || ''}
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              )}
              {validationError && (
                <p className="text-[11px] font-semibold text-rose-600 pl-1">
                  {validationError}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={onCancel}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              ref={confirmButtonRef}
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-xl font-bold uppercase text-[11px] tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 ${variantStyles.button}`}
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{confirmText}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

type ConfirmFn = (options: ConfirmOptions) => Promise<ConfirmResult>;

const ConfirmDialogContext = createContext<ConfirmFn | undefined>(undefined);

export const ConfirmDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve?: (result: ConfirmResult) => void;
  }>({
    isOpen: false,
    options: { title: '', description: '' },
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<ConfirmResult> => {
    return new Promise<ConfirmResult>((resolve) => {
      setDialogState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback((value?: string) => {
    setDialogState((prev) => {
      prev.resolve?.({ isConfirmed: true, value });
      return { ...prev, isOpen: false, resolve: undefined };
    });
  }, []);

  const handleCancel = useCallback(() => {
    setDialogState((prev) => {
      prev.resolve?.({ isConfirmed: false });
      return { ...prev, isOpen: false, resolve: undefined };
    });
  }, []);

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        {...dialogState.options}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirm = (): ConfirmFn => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useConfirm deve ser utilizado dentro de um ConfirmDialogProvider');
  }
  return context;
};

