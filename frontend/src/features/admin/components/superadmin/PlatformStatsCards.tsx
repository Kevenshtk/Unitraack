import React from 'react';
import { Building2, Users, BarChart3 } from 'lucide-react';
import type { PlatformStats, Tenant } from './types';

export interface PlatformStatsCardsProps {
  stats: PlatformStats | null;
  tenants: Tenant[];
}

export const PlatformStatsCards: React.FC<PlatformStatsCardsProps> = ({
  stats,
  tenants
}) => {
  return (
    <div className="space-y-8">
      {/* 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-5 mb-8">
        <StatCard
          label="Usinas Integradas"
          value={stats?.totalTenants.toString() || '0'}
          icon={<Building2 className="w-5 h-5" />}
          color="bg-sky-50 text-sky-600 border border-sky-100/80"
        />
        <StatCard
          label="Usuários no SaaS"
          value={stats?.totalUsers.toString() || '0'}
          icon={<Users className="w-5 h-5" />}
          color="bg-emerald-50 text-emerald-600 border border-emerald-100/80"
        />
        <StatCard
          label="Requisições Ativas"
          value={stats?.totalRequests.toString() || '0'}
          icon={<BarChart3 className="w-5 h-5" />}
          color="bg-amber-50 text-amber-600 border border-amber-100/80"
        />
      </div>

      {/* Seção de Usinas - Visualização Pura de Informações */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-navy text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <span>Unidades Industriais Integradas</span>
          </h3>
          <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200/80 px-3 py-1 rounded-xl shadow-xs">
            {tenants.length} {tenants.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>

        {tenants.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-navy">Nenhuma usina cadastrada</p>
            <p className="text-xs text-slate-400 mt-1">
              Acesse a aba "Gerenciar Usinas" no menu lateral para cadastrar e gerenciar unidades.
            </p>
          </div>
        ) : (
          tenants.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="w-full">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-xs overflow-hidden shrink-0"
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
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h4 className="font-bold text-navy text-sm">{t.name}</h4>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium inline-flex items-center gap-1.5 border ${
                        t.active !== false
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${t.active !== false ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        {t.active !== false ? 'Regularizado' : 'Desativada'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{t.cnpj}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-medium">Subdomínio / Link</p>
                    <p className="text-xs font-semibold text-navy mt-0.5 truncate">{t.subdomain}.localhost</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-medium">Gestores / Emissão</p>
                    <p className="text-xs font-semibold text-navy mt-0.5">
                      {Number(t.gestores?.[0]?.count || 0)} gestor(es) · {new Date(t.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-center">
                    <p className="text-[10px] text-slate-400 font-medium mb-1">Paleta Visual</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full shadow-xs border border-white" style={{ backgroundColor: t.company_color || '#00B5AD' }} title="Primária" />
                      <span className="w-3.5 h-3.5 rounded-full shadow-xs border border-white" style={{ backgroundColor: t.secondary_color || '#1996DC' }} title="Secundária" />
                      <span className="w-3.5 h-3.5 rounded-full shadow-xs border border-white" style={{ backgroundColor: t.tertiary_color || '#001D4A' }} title="Terciária" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} shadow-xs`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-2xl md:text-3xl font-bold text-navy tracking-tight mt-1">{value}</p>
      </div>
    </div>
  );
}
