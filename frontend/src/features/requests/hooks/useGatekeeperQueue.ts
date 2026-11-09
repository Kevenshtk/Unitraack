import { useState, useEffect, useCallback, useMemo } from 'react';
import { gatekeeperService } from '../api/gatekeeperService';
import type {
  ActiveTab,
  CompanyDetails,
  EntrySubFilter,
  ExitSubFilter,
  MobileSection,
  Requisicao
} from '../components/portaria/types';

export function useGatekeeperQueue(userTenantId?: string) {
  const [requisicoes, setRequisicoes] = useState<Requisicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selecionadoId, setSelecionadoId] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyDetails | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('ENTRY');
  const [entrySubFilter, setEntrySubFilter] = useState<EntrySubFilter>('WAITING');
  const [exitSubFilter, setExitSubFilter] = useState<ExitSubFilter>('WAITING');
  const [mobileSection, setMobileSection] = useState<MobileSection>('list');
  const [auditHistory, setAuditHistory] = useState<any[]>([]);
  const [isHistoryPageOpen, setIsHistoryPageOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchAuditHistory = useCallback(
    async (id?: string) => {
      const targetId = id || userTenantId;
      if (!targetId) return;
      try {
        setLoadingHistory(true);
        const historyData = await gatekeeperService.getAuditHistory(targetId, true);
        setAuditHistory(Array.isArray(historyData) ? historyData : []);
      } catch (err) {
        console.error('Erro ao buscar histórico:', err);
      } finally {
        setLoadingHistory(false);
      }
    },
    [userTenantId]
  );

  const fetchRequisicoes = useCallback(async () => {
    try {
      setLoading(true);
      const statusList =
        activeTab === 'ENTRY'
          ? [
              'APPROVED_LIDER',
              'APPROVED_GESTOR',
              'APPROVED',
              'WAITING_ARRIVAL',
              'ARRIVED',
              'IN_ANALYSIS',
              'DISCREPANCY'
            ]
          : activeTab === 'EXIT'
          ? ['WAITING_EXIT', 'EXIT_CONFERENCE', 'IN_PLANTA']
          : ['IN_PLANTA', 'DISCREPANCY', 'WAITING_EXIT', 'EXIT_CONFERENCE'];

      const data = await gatekeeperService.getApprovedRequests(statusList);
      setRequisicoes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar requisicoes:', err);
      setRequisicoes([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedCompany?.id) {
      fetchAuditHistory(selectedCompany.id);
    }
  }, [selectedCompany, fetchAuditHistory]);

  useEffect(() => {
    if (isHistoryPageOpen && userTenantId) {
      fetchAuditHistory(userTenantId);
    }
  }, [isHistoryPageOpen, userTenantId, fetchAuditHistory]);

  useEffect(() => {
    fetchRequisicoes();
    setSelecionadoId(null);
    setEntrySubFilter('WAITING');
    setExitSubFilter('WAITING');
  }, [activeTab, fetchRequisicoes]);

  useEffect(() => {
    if (selecionadoId) {
      setMobileSection('details');
    }
  }, [selecionadoId]);

  const selectedReq = useMemo(
    () => (Array.isArray(requisicoes) ? requisicoes.find(r => r.id === selecionadoId) || null : null),
    [requisicoes, selecionadoId]
  );

  const filteredReqs = useMemo(() => {
    if (!Array.isArray(requisicoes)) return [];
    return requisicoes
      .filter(r => {
        if (activeTab === 'EXIT') {
          const hasExitMaterials =
            r.materials?.some(m => ['WAITING_EXIT', 'EXIT_CONFERENCE'].includes(m.status)) ||
            ['WAITING_EXIT', 'EXIT_CONFERENCE'].includes(r.status);
          if (!hasExitMaterials) return false;

          const isWaitingExit =
            r.status === 'WAITING_EXIT' || r.materials?.some(m => m.status === 'WAITING_EXIT');
          const isConference =
            r.status === 'EXIT_CONFERENCE' || r.materials?.some(m => m.status === 'EXIT_CONFERENCE');

          if (exitSubFilter === 'WAITING' && !isWaitingExit) return false;
          if (exitSubFilter === 'CONFERENCE' && !isConference) return false;
        }
        if (activeTab === 'IN_PLANTA' && !r.materials?.some(m => m.status === 'IN_PLANTA')) {
          return false;
        }
        if (activeTab === 'ENTRY') {
          if (
            r.status === 'DISCREPANCY' &&
            (r.gate_checked_at || r.materials?.some(m => m.status === 'IN_PLANTA'))
          ) {
            return false;
          }

          const isWaiting = [
            'APPROVED_LIDER',
            'APPROVED_GESTOR',
            'APPROVED',
            'WAITING_ARRIVAL'
          ].includes(r.status);
          const isArrived = r.status === 'ARRIVED';
          const isAnalysis = r.status === 'IN_ANALYSIS';
          const isDiscrepancy = r.status === 'DISCREPANCY';

          if (entrySubFilter === 'WAITING' && !isWaiting) return false;
          if (entrySubFilter === 'ARRIVED' && !isArrived) return false;
          if (entrySubFilter === 'ANALYSIS' && !(isAnalysis || isDiscrepancy)) return false;
        }
        if (activeTab === 'IN_PLANTA') {
          if (
            r.status === 'DISCREPANCY' &&
            !r.gate_checked_at &&
            !r.materials?.some(m => m.status === 'IN_PLANTA')
          ) {
            return false;
          }
        }
        const search = (searchTerm || '').toLowerCase();
        const matchesName = (r.profile?.full_name || '').toLowerCase().includes(search);
        const matchesId = (r.id || '').toLowerCase().includes(search);
        const matchesMaterials = (r.materials || []).some(
          m =>
            (m.name || '').toLowerCase().includes(search) ||
            (m.serial_number || '').toLowerCase().includes(search)
        );
        return matchesName || matchesId || matchesMaterials;
      })
      .sort((a, b) => {
        const dateA = a.entry_date ? new Date(a.entry_date).getTime() : 0;
        const dateB = b.entry_date ? new Date(b.entry_date).getTime() : 0;
        if (dateA !== dateB) return dateA - dateB;
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
  }, [requisicoes, activeTab, entrySubFilter, exitSubFilter, searchTerm]);

  return {
    requisicoes,
    setRequisicoes,
    filteredReqs,
    loading,
    searchTerm,
    setSearchTerm,
    selecionadoId,
    setSelecionadoId,
    selectedReq,
    activeTab,
    setActiveTab,
    entrySubFilter,
    setEntrySubFilter,
    exitSubFilter,
    setExitSubFilter,
    mobileSection,
    setMobileSection,
    auditHistory,
    isHistoryPageOpen,
    setIsHistoryPageOpen,
    loadingHistory,
    selectedCompany,
    setSelectedCompany,
    fetchRequisicoes,
    fetchAuditHistory
  };
}
