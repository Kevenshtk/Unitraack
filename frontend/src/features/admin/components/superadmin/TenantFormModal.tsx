import React, { useState } from 'react';
import {
  X, CheckCircle2, Check, Copy, Sparkles, Globe,
  Loader2, Building2, ShieldCheck, Palette
} from 'lucide-react';
import type { Tenant, TenantFormData, ExtractionFeedback } from './types';

export interface TenantFormModalProps {
  isOpen: boolean;
  editingTenant: Tenant | null;
  tenants: Tenant[];
  creating: boolean;
  formData: TenantFormData;
  setFormData: React.Dispatch<React.SetStateAction<TenantFormData>>;
  generatedInvite: string | null;
  copySuccess: boolean;
  websiteInput: string;
  onWebsiteInputChange: (url: string) => void;
  isExtractingBranding: boolean;
  detectedPalette: string[];
  activeColorSlot: 'primary' | 'secondary' | 'tertiary';
  onActiveColorSlotChange: (slot: 'primary' | 'secondary' | 'tertiary') => void;
  extractionFeedback: ExtractionFeedback | null;
  onAutoDetectBranding: (urlToScan?: string) => void;
  onCopyInviteLink: (token?: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const COLOR_SLOTS = [
  { key: 'primary' as const, field: 'companyColor' as const, title: '1. Primária', desc: 'Botões de ação e destaques', fallback: '#00B5AD' },
  { key: 'secondary' as const, field: 'secondaryColor' as const, title: '2. Secundária', desc: 'Gradientes, badges e acentos', fallback: '#1996DC' },
  { key: 'tertiary' as const, field: 'tertiaryColor' as const, title: '3. Base / Escura', desc: 'Hero do login, topbar e contraste', fallback: '#001D4A' }
];

export const TenantFormModal: React.FC<TenantFormModalProps> = ({
  isOpen, editingTenant, tenants, creating, formData, setFormData,
  generatedInvite, copySuccess, websiteInput, onWebsiteInputChange,
  isExtractingBranding, detectedPalette, activeColorSlot, onActiveColorSlotChange,
  extractionFeedback, onAutoDetectBranding, onCopyInviteLink, onSubmit, onClose
}) => {
  const [copyPortalSuccess, setCopyPortalSuccess] = useState(false);

  if (!isOpen) return null;

  const targetSubdomain = tenants.find(
    (t) => t.id === editingTenant?.id || t.name === formData.tenantName
  )?.subdomain || 'unidade';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#001D4A]/40 backdrop-blur-sm animate-in fade-in duration-500 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-xl rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] overflow-y-auto max-h-[90vh] border border-slate-100 cursor-default"
      >
        <div className="p-8 sm:p-10 space-y-6">
          {generatedInvite ? (
            <div className="space-y-8 py-4 animate-in zoom-in-95 duration-300 text-center">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-navy uppercase tracking-tighter">Unidade Ativada!</h3>
                <p className="text-slate-400 font-medium mt-2 px-6 text-sm">
                  A usina foi cadastrada. Envie o link abaixo para o gestor responsável realizar o auto-cadastro.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-xl">
                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Convite do Gestor</span>
                    <span className="text-[10px] font-bold text-navy truncate block" title={generatedInvite}>{generatedInvite}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCopyInviteLink()}
                    className={`shrink-0 px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                      copySuccess ? 'bg-emerald-500 text-white' : 'bg-navy text-white hover:bg-navy/80 active:scale-95'
                    }`}
                  >
                    {copySuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copySuccess ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-xl">
                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Portal da Usina (Terceirizadas)</span>
                    <span className="text-[10px] font-bold text-primary truncate block">
                      {window.location.origin}/{targetSubdomain}/login
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/${targetSubdomain}/login`);
                      setCopyPortalSuccess(true);
                      setTimeout(() => setCopyPortalSuccess(false), 2000);
                    }}
                    className={`shrink-0 px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                      copyPortalSuccess ? 'bg-emerald-500 text-white' : 'bg-primary text-white hover:bg-primary/80 active:scale-95'
                    }`}
                  >
                    {copyPortalSuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copyPortalSuccess ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 bg-slate-100 text-slate-500 font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
              >
                Concluir e Fechar
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-navy uppercase tracking-tighter leading-none">
                    {editingTenant ? 'Editar' : 'Ativar'} <span className="text-primary italic">Unidade</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 px-1">Configuração de Infraestrutura</p>
                </div>
                <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-xl transition-all cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Bloco de Auto-Detecção / Scraping */}
              <div className="bg-gradient-to-r from-primary/10 via-blue-50/50 to-emerald-50/30 p-4 rounded-2xl border border-primary/20 space-y-3 shadow-inner">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 text-primary font-bold text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    Auto-Detectar Marca & Cores
                  </div>
                  {extractionFeedback && (
                    <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${
                      extractionFeedback.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {extractionFeedback.message}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1 group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="Cole a URL do site (ex: https://usina.com.br)"
                      value={websiteInput}
                      onChange={(e) => onWebsiteInputChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          onAutoDetectBranding();
                        }
                      }}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-navy placeholder:text-slate-300 focus:outline-none focus:border-primary transition-all shadow-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onAutoDetectBranding()}
                    disabled={isExtractingBranding || !websiteInput.trim()}
                    className="px-5 py-3 bg-primary hover:bg-[#009e96] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-md shadow-primary/20 cursor-pointer"
                  >
                    {isExtractingBranding ? <><Loader2 className="w-4 h-4 animate-spin" />Lendo...</> : <><Sparkles className="w-4 h-4" />Escanear</>}
                  </button>
                </div>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">
                <FormInput label="Identificação da Usina" icon={<Building2 className="w-4 h-4" />} value={formData.tenantName} onChange={(v) => setFormData({ ...formData, tenantName: v })} placeholder="Ex: Lins Agro Unidade 02" required />
                <FormInput label="CNPJ" icon={<ShieldCheck className="w-4 h-4" />} value={formData.tenantCnpj} onChange={(v) => setFormData({ ...formData, tenantCnpj: v })} placeholder="00.000.000/0000-00" required />
                <FormInput label="URL do Logo" icon={<Globe className="w-4 h-4" />} value={formData.logoUrl} onChange={(v) => setFormData({ ...formData, logoUrl: v })} placeholder="https://exemplo.com/logo.png" />

                {/* Bloco de Tríade de Cores */}
                <div className="space-y-3 p-4 bg-slate-50/60 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                      <Palette className="w-4 h-4 text-primary" />
                      Tríade de Cores da Usina
                    </label>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">3 Cores Oficiais</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {COLOR_SLOTS.map((slot) => (
                      <div
                        key={slot.key}
                        onClick={() => onActiveColorSlotChange(slot.key)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          activeColorSlot === slot.key ? 'bg-white border-primary shadow-md ring-2 ring-primary/20' : 'bg-white/60 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">{slot.title}</span>
                          {activeColorSlot === slot.key && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="relative cursor-pointer shrink-0">
                            <input
                              type="color"
                              value={formData[slot.field] || slot.fallback}
                              onChange={(e) => setFormData({ ...formData, [slot.field]: e.target.value })}
                              className="sr-only"
                            />
                            <div
                              className="w-9 h-9 rounded-lg border border-white/60 shadow-sm transition-transform hover:scale-105"
                              style={{ backgroundColor: formData[slot.field] || slot.fallback }}
                            />
                          </label>
                          <input
                            type="text"
                            value={formData[slot.field]}
                            onChange={(e) => setFormData({ ...formData, [slot.field]: e.target.value })}
                            placeholder={slot.fallback}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-navy font-mono font-bold text-xs focus:outline-none focus:border-primary uppercase"
                          />
                        </div>
                        <p className="text-[8px] text-slate-400 font-medium mt-1">{slot.desc}</p>
                      </div>
                    ))}
                  </div>

                  {detectedPalette.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mr-1">
                        Paleta Detectada (slot: {COLOR_SLOTS.find(s => s.key === activeColorSlot)?.title}):
                      </span>
                      {detectedPalette.map((c) => {
                        const field = COLOR_SLOTS.find(s => s.key === activeColorSlot)!.field;
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setFormData({ ...formData, [field]: c })}
                            className="w-7 h-7 rounded-lg transition-transform hover:scale-110 shadow-sm border border-slate-300 cursor-pointer"
                            style={{ backgroundColor: c }}
                            title={`Aplicar ${c}`}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Preview da Identidade Visual */}
                {(formData.logoUrl || formData.companyColor) && (
                  <div
                    className="p-5 rounded-2xl border border-white/20 shadow-lg text-white relative overflow-hidden transition-all duration-500"
                    style={{ backgroundColor: formData.tertiaryColor || '#001D4A' }}
                  >
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md p-2 flex items-center justify-center border border-white/20 shrink-0">
                        {formData.logoUrl ? (
                          <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <span className="text-lg font-black text-white">{formData.tenantName?.[0] || 'U'}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-white uppercase tracking-tight truncate">{formData.tenantName || 'Nome da Usina'}</h4>
                        <p className="text-[10px] text-white/70">Prévia da Identidade Visual (3 Cores)</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: formData.secondaryColor || '#1996DC' }}>
                        Portal
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full py-4 bg-navy text-white font-bold uppercase text-xs tracking-widest rounded-xl shadow-xl shadow-navy/20 hover:bg-[#002880] transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  {creating ? <Loader2 className="animate-spin" /> : (editingTenant ? 'Salvar Configurações' : 'Confirmar & Gerar Acesso')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function FormInput({ label, placeholder, value, onChange, icon, required }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void; icon: React.ReactNode; required?: boolean;
}) {
  return (
    <div className="space-y-1.5 w-full group">
      <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">{icon}</div>
        <input
          type="text"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl text-navy placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm shadow-inner"
        />
      </div>
    </div>
  );
}
