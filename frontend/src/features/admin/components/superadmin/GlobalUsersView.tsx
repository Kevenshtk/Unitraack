import React from 'react';
import {
  Users, Building2, Briefcase, ChevronRight, ChevronDown,
  ArrowLeft, Search, Loader2, UserX, UserCheck, Phone, Power, PowerOff
} from 'lucide-react';
import type { GlobalProfile, Tenant, UserCategoryFilter, UserStatusFilter } from './types';

export interface GlobalUsersViewProps {
  allUsers: GlobalProfile[];
  filteredUsers: GlobalProfile[];
  tenants: Tenant[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedTenantId: string;
  onSelectTenant: (tenantId: string) => void;
  categoryFilter: UserCategoryFilter;
  onCategoryFilterChange: (filter: UserCategoryFilter) => void;
  statusFilter: UserStatusFilter;
  onStatusFilterChange: (filter: UserStatusFilter) => void;
  expandedSections: string[];
  onToggleSection: (sectionId: string) => void;
  updatingUserId: string | null;
  onToggleUserStatus: (userId: string, currentActive: boolean) => void;
}

const ROLE_LABELS: Record<string, string> = {
  GESTOR_SEGURANCA: 'Gestor de Segurança',
  LIDER_SETOR: 'Líder de Setor',
  PORTARIA: 'Portaria & Acesso'
};

export const GlobalUsersView: React.FC<GlobalUsersViewProps> = ({
  allUsers, filteredUsers, tenants, searchTerm, onSearchChange,
  selectedTenantId, onSelectTenant, categoryFilter, onCategoryFilterChange,
  statusFilter, onStatusFilterChange, expandedSections, onToggleSection,
  updatingUserId, onToggleUserStatus
}) => {
  const targetTenant = tenants.find((t) => t.id === selectedTenantId);
  const tenantAllUsers = allUsers.filter((u) => u.tenant?.id === selectedTenantId && u.role !== 'SUPER_ADMIN');
  const colaboradores = filteredUsers.filter((u) => u.role !== 'TERCEIRIZADA');
  const terceirizadas = filteredUsers.filter((u) => u.role === 'TERCEIRIZADA');
  const isSearchActive = searchTerm.trim() !== '';

  const isColabOpen = expandedSections.includes('colaboradores') || (isSearchActive && colaboradores.length > 0);
  const isTercOpen = expandedSections.includes('terceirizadas') || (isSearchActive && terceirizadas.length > 0);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-navy">Gerenciamento de Usuários</h2>
        <p className="text-xs text-slate-500 mt-0.5">Controle de colaboradores internos e empresas terceirizadas por unidade industrial.</p>
      </div>

      {!selectedTenantId ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="max-w-lg mb-6">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Etapa 1</span>
            <h3 className="text-base font-bold text-navy mt-1">Selecione uma Unidade Industrial</h3>
            <p className="text-xs text-slate-500 mt-1">Clique na usina que deseja consultar para visualizar e gerenciar sua equipe e empresas parceiras.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenants.map((t) => {
              const tUsers = allUsers.filter((u) => u.tenant?.id === t.id && u.role !== 'SUPER_ADMIN');
              const colabCount = tUsers.filter((u) => u.role !== 'TERCEIRIZADA').length;
              const tercCount = tUsers.filter((u) => u.role === 'TERCEIRIZADA').length;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelectTenant(t.id)}
                  className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200/80 hover:border-primary/50 bg-white hover:bg-slate-50/50 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-start gap-3.5">
                    <TenantAvatar tenant={t} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-navy text-sm truncate group-hover:text-primary transition-colors">{t.name}</h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">CNPJ: {t.cnpj}</p>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{colabCount} colaboradores · {tercCount} terceirizadas</span>
                    <span className="text-primary font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Gerenciar <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : !targetTenant ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80">
          <p className="text-sm font-semibold text-navy">Unidade não encontrada.</p>
          <button type="button" onClick={() => onSelectTenant('')} className="mt-3 px-4 py-2 bg-navy text-white text-xs font-bold rounded-xl cursor-pointer">
            Selecionar outra unidade
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => onSelectTenant('')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-navy text-xs font-bold transition-all shadow-xs cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar para Lista de Usinas</span>
          </button>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <TenantAvatar tenant={targetTenant} />
              <div>
                <h3 className="text-base font-bold text-navy">{targetTenant.name}</h3>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-medium">
                  <span className="font-mono">CNPJ: {targetTenant.cnpj}</span>
                  <span>·</span>
                  <span>{tenantAllUsers.filter(u => u.role !== 'TERCEIRIZADA').length} colaboradores</span>
                  <span>·</span>
                  <span>{tenantAllUsers.filter(u => u.role === 'TERCEIRIZADA').length} terceirizadas</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Alternar Empresa:</span>
              <select
                value={selectedTenantId}
                onChange={(e) => onSelectTenant(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-navy shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer max-w-[200px] truncate"
              >
                {tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome, email, cargo, setor ou empresa..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl shrink-0">
                {(['all', 'internal', 'terceirizada'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onCategoryFilterChange(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${categoryFilter === cat ? 'bg-white text-navy shadow-xs' : 'text-slate-500 hover:text-navy'}`}
                  >
                    {cat === 'internal' && <Building2 className="w-3.5 h-3.5 text-primary" />}
                    {cat === 'terceirizada' && <Briefcase className="w-3.5 h-3.5 text-blue-600" />}
                    <span>{cat === 'all' ? 'Todos' : cat === 'internal' ? 'Colaboradores' : 'Terceirizadas'}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl shrink-0">
                {([
                  { id: 'all', label: 'Todos', cls: 'text-navy' },
                  { id: 'active', label: 'Ativos', cls: 'text-emerald-700' },
                  { id: 'inactive', label: 'Desativados', cls: 'text-rose-700' }
                ] as const).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onStatusFilterChange(st.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${statusFilter === st.id ? `bg-white shadow-xs font-bold ${st.cls}` : 'text-slate-500'}`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80 shadow-xs">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
              <p className="text-sm font-bold text-navy">Nenhum registro encontrado</p>
              <p className="text-xs text-slate-400 mt-1">Não encontramos colaboradores ou terceirizadas com os filtros selecionados.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {([
                categoryFilter !== 'terceirizada' ? {
                  key: 'colaboradores', title: 'Colaboradores & Gestão da Usina',
                  subtitle: 'Gestores de segurança, líderes de setor e equipe de portaria',
                  icon: <Building2 className="w-5 h-5" />, accent: 'bg-primary/10 text-primary',
                  users: colaboradores, isExpanded: isColabOpen, variant: 'internal' as const,
                  headers: ['Colaborador', 'Cargo / Perfil', 'Setor', 'Status', 'Ação']
                } : null,
                categoryFilter !== 'internal' ? {
                  key: 'terceirizadas', title: 'Empresas Terceirizadas Credenciadas',
                  subtitle: 'Prestadoras de serviços com acesso credenciado à planta',
                  icon: <Briefcase className="w-5 h-5" />, accent: 'bg-blue-50 text-blue-600',
                  users: terceirizadas, isExpanded: isTercOpen, variant: 'terceirizada' as const,
                  headers: ['Empresa Terceirizada', 'CNPJ', 'Representante & Contato', 'Status', 'Ação']
                } : null
              ] as const).map((sec) => sec && (
                <CollapsibleUserSection
                  key={sec.key}
                  title={sec.title}
                  subtitle={sec.subtitle}
                  icon={sec.icon}
                  accent={sec.accent}
                  users={sec.users}
                  isExpanded={sec.isExpanded}
                  variant={sec.variant}
                  headers={sec.headers}
                  onToggle={() => onToggleSection(sec.key)}
                  updatingUserId={updatingUserId}
                  onToggleStatus={onToggleUserStatus}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function TenantAvatar({ tenant }: { tenant: Tenant }) {
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-xs shrink-0 overflow-hidden"
      style={{ backgroundColor: tenant.tertiary_color || tenant.company_color || '#001D4A' }}
    >
      {tenant.logo_url ? (
        <img src={tenant.logo_url} alt={tenant.name} className="w-full h-full object-contain p-1.5" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      ) : tenant.name[0]}
    </div>
  );
}

function CollapsibleUserSection({
  title, subtitle, icon, accent, users, isExpanded, onToggle, headers, updatingUserId, onToggleStatus, variant
}: {
  title: string; subtitle: string; icon: React.ReactNode; accent: string;
  users: GlobalProfile[]; isExpanded: boolean; onToggle: () => void;
  headers: readonly string[]; updatingUserId: string | null;
  onToggleStatus: (id: string, active: boolean) => void;
  variant: 'internal' | 'terceirizada';
}) {
  const activeCount = users.filter((u) => u.is_active !== false).length;
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden transition-all">
      <button type="button" onClick={onToggle} className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer text-left">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${accent} flex items-center justify-center font-bold shrink-0`}>{icon}</div>
          <div>
            <h4 className="font-bold text-navy text-sm">{title} <span className="text-xs text-slate-400 font-medium">({users.length})</span></h4>
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">{activeCount} {variant === 'internal' ? 'ativos' : 'ativas'}</span>
          <div className={`p-1.5 rounded-lg bg-slate-100 text-slate-400 transition-all ${isExpanded ? 'rotate-180 bg-primary/10 text-primary' : ''}`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-slate-100">
          {users.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">Nenhum registro encontrado nesta seção com os filtros atuais.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    {headers.map((h, idx) => <th key={h} className={`px-5 py-3 ${idx === 3 ? 'text-center' : idx === 4 ? 'text-right' : ''}`}>{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {users.map((u) => {
                    const isActive = u.is_active !== false;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${variant === 'internal' ? 'rounded-full bg-slate-100 text-slate-700' : 'rounded-xl bg-blue-50 border border-blue-100 text-blue-600'} font-bold flex items-center justify-center text-xs shrink-0`}>
                              {variant === 'internal' ? (u.full_name?.[0]?.toUpperCase() || '?') : <Briefcase className="w-4 h-4" />}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-navy text-xs">{u.full_name}</span>
                              <span className="text-[11px] text-slate-400 mt-0.5">{u.email}</span>
                              {u.registration_number && <span className="text-[10px] text-slate-400 font-mono">Matrícula: {u.registration_number}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          {variant === 'internal'
                            ? <span className="text-xs font-medium text-slate-700">{ROLE_LABELS[u.role] || u.role}</span>
                            : <span className="font-mono text-xs text-slate-700">{u.cnpj || '—'}</span>}
                        </td>
                        <td className="px-5 py-3.5">
                          {variant === 'internal' ? <span className="text-xs text-slate-600">{u.sector || 'Todos os setores'}</span> : (
                            <div className="flex flex-col text-xs">
                              <span className="font-medium text-slate-700">{u.representative_name || 'Responsável não informado'}</span>
                              {u.phone && <span className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1"><Phone className="w-3 h-3" />{u.phone}</span>}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {isActive ? (variant === 'internal' ? 'Ativo' : 'Ativa') : (variant === 'internal' ? 'Desativado' : 'Desativada')}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => onToggleStatus(u.id, isActive)}
                            disabled={updatingUserId === u.id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer disabled:opacity-50 ${
                              isActive ? 'border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-700' : 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {updatingUserId === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : isActive ? (variant === 'internal' ? <UserX className="w-3.5 h-3.5 text-rose-600" /> : <PowerOff className="w-3.5 h-3.5 text-rose-600" />)
                              : (variant === 'internal' ? <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Power className="w-3.5 h-3.5 text-emerald-600" />)}
                            <span>{isActive ? (variant === 'internal' ? 'Desativar' : 'Desativar Empresa') : (variant === 'internal' ? 'Ativar' : 'Ativar Empresa')}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
