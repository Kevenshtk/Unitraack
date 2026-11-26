import { useState, useEffect, useMemo, useCallback } from 'react';
import { superAdminService } from '../api/superAdminService';
import type {
  PlatformStats,
  AuditLog,
  SuperAdminTab
} from '../components/superadmin/types';

export function useSuperAdminStats(activeTab: SuperAdminTab) {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [selectedMonitoringTenant, setSelectedMonitoringTenant] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchAuditLogs = useCallback(async (tenantId: string) => {
    if (!tenantId) {
      setAuditLogs([]);
      return;
    }
    setLoadingLogs(true);
    try {
      const logs = await superAdminService.getTenantAudit(tenantId);
      setAuditLogs(logs);
    } catch (err) {
      console.error('Erro ao buscar logs de auditoria:', err);
      setAuditLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'monitoring' && selectedMonitoringTenant) {
      setCurrentPage(1);
      fetchAuditLogs(selectedMonitoringTenant);
    }
  }, [activeTab, selectedMonitoringTenant, fetchAuditLogs]);

  const totalAuditPages = useMemo(
    () => Math.max(1, Math.ceil(auditLogs.length / itemsPerPage)),
    [auditLogs.length]
  );

  const paginatedLogs = useMemo(
    () => auditLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [auditLogs, currentPage]
  );

  return {
    stats,
    setStats,
    selectedMonitoringTenant,
    setSelectedMonitoringTenant,
    auditLogs,
    loadingLogs,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    paginatedLogs,
    totalAuditPages,
    fetchAuditLogs
  };
}
