import React from 'react';
import {
  Building2,
  PlusCircle,
  Search,
  Power,
  PowerOff,
  Copy,
  ExternalLink,
  Pencil,
  Trash2
} from 'lucide-react';
import type { Tenant } from './types';

export interface TenantsManagementViewProps {
  tenants: Tenant[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  updatingTenantId: string | null;
  onOpenCreate: () => void;
  onOpenEdit: (tenant: Tenant) => void;
  onGenerateInvite: (tenantId: string) => void;
  onToggleStatus: (tenantId: string, currentActive: boolean) => void;
  onDeleteTenant: (tenantId: string) => void;
}

export const TenantsManagementView: React.FC<TenantsManagementViewProps> = ({
  tenants,
  searchTerm,
  onSearchChange,
  updatingTenantId,
  onOpenCreate,
  onOpenEdit,
  onGenerateInvite,
  onToggleStatus,
  onDeleteTenant
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy">Gerenciar Usinas</h2>
          <p className="text-xs text-slate-500 mt-0.5">Central de controle, edição e cadastramento de unidades federadas.</p>
        </div>
        <button
          onClick={onOpenCreate}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-xs transition-all cursor-pointer w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Cadastrar Unidade</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrar por nome, CNPJ ou subdomínio..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-xl shadow-xs text-xs font-medium text-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-xs self-end sm:self-auto">
          {tenants.length} {tenants.length === 1 ? 'usina' : 'usinas'}
        </span>
      </div>

      {tenants.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-navy">Nenhuma usina encontrada</p>
          <p className="text-xs text-slate-400 mt-1">
            Tente ajustar os termos de busca ou clique em "Cadastrar Unidade" para adicionar uma nova.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Unidade / Identidade</th>
                <th className="px-6 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Contrato</th>
                <th className="px-6 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Ativação</th>
                <th className="px-6 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">Gestores</th>
                <th className="px-6 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-right">Controle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {tenants.map((t) => {
                const isUpdating = updatingTenantId === t.id;
                return (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-xs overflow-hidden shrink-0"
                          style={{ backgroundColor: t.tertiary_color || t.company_color || '#001D4A' }}
                        >
                          {t.logo_url ? (
                            <img
                              src={t.logo_url}
                              alt={t.name}
                              className="w-full h-full object-contain p-1.5"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            t.name[0]
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-navy text-xs leading-tight">{t.name}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-primary font-medium">{t.subdomain}.localhost</span>
                            <div className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="text-[10px] text-slate-400">{t.cnpj}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="w-2.5 h-2.5 rounded-full shadow-xs border border-white" style={{ backgroundColor: t.company_color || '#00B5AD' }} title="Cor Primária" />
                            <span className="w-2.5 h-2.5 rounded-full shadow-xs border border-white" style={{ backgroundColor: t.secondary_color || '#1996DC' }} title="Cor Secundária" />
                            <span className="w-2.5 h-2.5 rounded-full shadow-xs border border-white" style={{ backgroundColor: t.tertiary_color || '#001D4A' }} title="Cor Terciária / Base" />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {t.active !== false ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200/80 inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          Ativa
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-full border border-amber-300 inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                          Desativada
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600">{new Date(t.created_at).toLocaleDateString('pt-BR')}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold border border-slate-100">
                        {Number(t.gestores?.[0]?.count || 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <ActionButton
                          disabled={isUpdating}
                          onClick={() => onToggleStatus(t.id, t.active !== false)}
                          icon={t.active !== false ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                          title={t.active !== false ? 'Desativar Usina' : 'Reativar Usina'}
                          color={t.active !== false ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'}
                        />
                        <ActionButton
                          onClick={() => onGenerateInvite(t.id)}
                          icon={<Copy className="w-3.5 h-3.5" />}
                          title="Convite Gestor"
                          color="text-slate-500 hover:text-navy hover:bg-slate-100"
                        />
                        <ActionButton
                          onClick={() => {
                            const url = `${window.location.origin}/${t.subdomain}/login`;
                            window.open(url, '_blank');
                            navigator.clipboard.writeText(url);
                          }}
                          icon={<ExternalLink className="w-3.5 h-3.5" />}
                          title="Portal"
                          color="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                        />
                        <ActionButton
                          onClick={() => onOpenEdit(t)}
                          icon={<Pencil className="w-3.5 h-3.5" />}
                          title="Editar"
                          color="text-slate-500 hover:text-primary hover:bg-primary/5"
                        />
                        <ActionButton
                          disabled={isUpdating}
                          onClick={() => onDeleteTenant(t.id)}
                          icon={<Trash2 className="w-3.5 h-3.5" />}
                          title="Excluir"
                          color="text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

function ActionButton({
  onClick,
  icon,
  title,
  color,
  disabled
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  color: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer disabled:opacity-50 ${color}`}
    >
      {icon}
    </button>
  );
}
