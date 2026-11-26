import React from 'react';
import { Search, Loader2, CheckCircle2 } from 'lucide-react';
import type { AuditLog, Tenant } from './types';

export interface TenantAuditViewProps {
  tenants: Tenant[];
  selectedTenantId: string;
  onSelectTenant: (tenantId: string) => void;
  paginatedLogs: AuditLog[];
  totalLogsCount: number;
  loadingLogs: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TenantAuditView: React.FC<TenantAuditViewProps> = ({
  tenants,
  selectedTenantId,
  onSelectTenant,
  paginatedLogs,
  totalLogsCount,
  loadingLogs,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy">Trilha de Auditoria & Rastro</h2>
          <p className="text-xs text-slate-500 mt-0.5">Rastreamento de movimentações e integridade de dados por unidade.</p>
        </div>

        <div className="flex items-center gap-2 min-w-[260px]">
          <select
            value={selectedTenantId}
            onChange={(e) => onSelectTenant(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200/80 rounded-xl shadow-xs text-xs font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
          >
            <option value="">Selecione uma Usina...</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedTenantId ? (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-16 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto border border-slate-200">
            <Search className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy">Aguardando Seleção da Usina</h3>
            <p className="text-slate-400 max-w-md mx-auto text-xs mt-1">
              Selecione uma usina acima para carregar o histórico completo de movimentações de materiais.
            </p>
          </div>
        </div>
      ) : loadingLogs ? (
        <div className="py-16 text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="text-slate-400 text-xs font-medium mt-3">Carregando registros de auditoria...</p>
        </div>
      ) : totalLogsCount === 0 ? (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-16 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy">Sem Movimentações</h3>
            <p className="text-slate-400 max-w-md mx-auto text-xs mt-1">
              Nenhuma movimentação de materiais registrada nesta unidade até o momento.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Horário / Data</th>
                <th className="px-6 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Responsável</th>
                <th className="px-6 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Ação / Material</th>
                <th className="px-6 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-navy">{new Date(log.moved_at).toLocaleTimeString('pt-BR')}</span>
                      <span className="text-[10px] text-slate-400">{new Date(log.moved_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-navy border border-slate-200">
                        {log.actor?.full_name?.[0] || 'U'}
                      </div>
                      <span className="font-semibold text-navy">{log.actor?.full_name || 'Usuário do Sistema'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-navy">{log.material?.name || 'Item não identificado'}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400">De: {log.from_sector?.name || 'ENTRADA'}</span>
                        <div className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="text-[10px] text-primary font-medium">Para: {log.to_sector?.name || 'Destino'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200/80">
                      Confirmado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white rounded-b-2xl">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-500 hover:text-navy hover:bg-slate-50 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
              >
                Anterior
              </button>
              <span className="text-xs text-slate-500">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-500 hover:text-navy hover:bg-slate-50 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
