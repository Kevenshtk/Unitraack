import { useState, useMemo, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { useConfirm } from '../../../components/common/ConfirmDialog';
import { leaderService } from '../api/leaderService';
import {
  type Requisicao,
  type Material,
  type MovementRecord,
  type CompanyDetails,
  type LiderInfo,
  type MovementFilterType,
  getLocalDateStr,
  isIncomingToSector,
  isOutgoingFromSector,
  isRelatedToSector,
  matchesMovementQuery
} from '../components/lider/types';

export function useLeaderOperations() {
  const { profile } = useAuth();
  const confirm = useConfirm();

  // Estados de dados
  const [requisicoes, setRequisicoes] = useState<Requisicao[]>([]);
  const [sectorMaterials, setSectorMaterials] = useState<Material[]>([]);
  const [movements, setMovements] = useState<MovementRecord[]>([]);
  const [liderInfo, setLiderInfo] = useState<LiderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Estados de busca e seleção
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForTransfer, setSelectedForTransfer] = useState<string[]>([]);
  const [movementSearch, setMovementSearch] = useState('');
  const [movementDate, setMovementDate] = useState('');
  const [movementFilterType, setMovementFilterType] = useState<MovementFilterType>('ALL');
  const [movementPage, setMovementPage] = useState(1);
  const MOVEMENTS_PER_PAGE = 10;

  // Modais de inspeção e ação
  const [selectedCompany, setSelectedCompany] = useState<CompanyDetails | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[] | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [itemToAccept, setItemToAccept] = useState<{ id: string; name: string } | null>(null);
  const [rejectModalTargetId, setRejectModalTargetId] = useState<string | null>(null);

  const currentSectorId = liderInfo?.sector_id || profile?.sector_id;
  const currentSectorName = (liderInfo?.sector || profile?.sector || '').trim().toLowerCase();

  const fetchPendencias = useCallback(async () => {
    try {
      const data = await leaderService.getPendencias();
      setRequisicoes(data.requests || []);
      if (data.lider) setLiderInfo(data.lider);
    } catch (err) {
      console.error('Erro ao buscar pendências:', err);
    }
  }, []);

  const fetchSectorMaterials = useCallback(async () => {
    try {
      const data = await leaderService.getSectorMaterials();
      setSectorMaterials(data || []);
    } catch (err) {
      console.error('Erro ao buscar materiais:', err);
    }
  }, []);

  const fetchMovements = useCallback(async () => {
    try {
      const targetId = liderInfo?.sector_id || profile?.sector_id;
      const data = await leaderService.getSectorMovements(targetId);
      setMovements(data || []);
    } catch (err) {
      console.error('Erro ao buscar movimentações:', err);
    }
  }, [liderInfo?.sector_id, profile?.sector_id]);

  const loadData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchPendencias(), fetchSectorMaterials(), fetchMovements()]);
    setLoading(false);
  }, [fetchPendencias, fetchSectorMaterials, fetchMovements]);

  useEffect(() => { loadData(); }, [loadData]);

  // Ações de Requisição
  const handleApprove = async (requestId: string) => {
    try {
      await leaderService.reviewRequest(requestId, { acao: 'APPROVE' });
      setRequisicoes(prev => prev.filter(r => r.id !== requestId));
      fetchSectorMaterials();
      toast.success('Requisição aprovada!');
    } catch (err: any) {
      toast.error('Erro ao Processar Ação', { description: err.response?.data?.error || 'Erro ao aprovar solicitação.' });
    }
  };

  const handleReject = async (requestId: string, reason?: string) => {
    try {
      await leaderService.reviewRequest(requestId, { acao: 'REJECT', reason });
      setRequisicoes(prev => prev.filter(r => r.id !== requestId));
      fetchSectorMaterials();
      setRejectModalTargetId(null);
      toast.success('Requisição rejeitada!');
    } catch (err: any) {
      toast.error('Erro ao Processar Ação', { description: err.response?.data?.error || 'Erro ao rejeitar solicitação.' });
    }
  };

  // Transferência e Saída
  const handleTransfer = async (toSectorId: string, signature: string, extraData?: any, photos?: string[]) => {
    if (selectedForTransfer.length === 0) return;
    setIsProcessing(true);
    try {
      await leaderService.transferMaterial({ materialIds: selectedForTransfer, toSectorId, signature, photos, ...extraData });
      setIsTransferModalOpen(false);
      setSelectedForTransfer([]);
      loadData();
      toast.success('Transferência Enviada com Sucesso!', { description: 'O equipamento agora está em trânsito para o setor destinatário.' });
    } catch (err: any) {
      toast.error('Erro na Transferência', { description: err.response?.data?.error || 'Erro ao processar transferência.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkExit = async (signature: string, extraData?: any, photos?: string[]) => {
    if (selectedForTransfer.length === 0) return;
    setIsProcessing(true);
    try {
      await leaderService.markMaterialForExit({ materialIds: selectedForTransfer, signature, photos, ...extraData });
      setIsExitModalOpen(false);
      setSelectedForTransfer([]);
      loadData();
      toast.success('Saída Solicitada!', { description: 'O equipamento foi encaminhado para conferência de saída na portaria.' });
    } catch (err: any) {
      toast.error('Erro na Saída', { description: err.response?.data?.error || 'Erro ao enviar para portaria.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Aceitar / Recusar / Cancelar Transferência
  const handleAcceptClick = (id: string, name: string) => {
    setItemToAccept({ id, name });
    setIsAcceptModalOpen(true);
  };

  const handleAcceptConfirm = async (signature: string, photos?: string[]) => {
    if (!itemToAccept) return;
    setIsProcessing(true);
    try {
      await leaderService.acceptTransfer({ materialIds: [itemToAccept.id], signature, photos });
      setIsAcceptModalOpen(false);
      setItemToAccept(null);
      loadData();
      toast.success('Transferência Aceita!');
    } catch (err: any) {
      toast.error('Erro ao Aceitar', { description: err.response?.data?.error || 'Erro ao aceitar transferência.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectTransferClick = async (materialId: string) => {
    const res = await confirm({
      title: 'Recusar Transferência?',
      description: 'Informe o motivo da recusa desta transferência de equipamento:',
      variant: 'danger',
      confirmText: 'Confirmar Recusa',
      cancelText: 'Voltar',
      inputConfig: {
        type: 'textarea',
        required: true,
        placeholder: 'Descreva o motivo da recusa (ex: equipamento não solicitado, item avariado)...',
        errorMessage: 'Você precisa informar o motivo da recusa!'
      }
    });
    if (!res.isConfirmed || !res.value) return;
    setIsProcessing(true);
    try {
      await leaderService.rejectTransfer({ materialIds: [materialId], reason: res.value.trim() });
      toast.success('Transferência Recusada!', { description: 'O item foi devolvido ao setor de origem.' });
      loadData();
    } catch (err: any) {
      toast.error('Erro', { description: err.response?.data?.error || 'Erro ao recusar.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelTransferClick = async (materialId: string) => {
    const res = await confirm({
      title: 'Cancelar Envio?',
      description: 'O equipamento deixará de estar em trânsito e voltará a ficar disponível no seu setor.',
      variant: 'danger',
      confirmText: 'Sim, Cancelar Envio',
      cancelText: 'Voltar'
    });
    if (!res.isConfirmed) return;
    setIsProcessing(true);
    try {
      await leaderService.cancelTransfer({ materialIds: [materialId] });
      toast.success('Envio Cancelado!', { description: 'O equipamento retornou ao seu setor.' });
      loadData();
    } catch (err: any) {
      toast.error('Erro', { description: err.response?.data?.error || 'Erro ao cancelar envio.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSelectMaterial = (id: string) => {
    setSelectedForTransfer(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAllMaterials = (ids: string[]) => setSelectedForTransfer(ids);

  const filteredMaterials = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return sectorMaterials.filter(m =>
      (m.status === 'IN_PLANTA' || m.status === 'MOVING') &&
      (m.name.toLowerCase().includes(q) || (m.serial_number && m.serial_number.toLowerCase().includes(q)))
    );
  }, [sectorMaterials, searchTerm]);

  const sectorMovements = useMemo(() => {
    return movements.filter(m => isRelatedToSector(m, currentSectorId, currentSectorName));
  }, [movements, currentSectorId, currentSectorName]);

  const dateFilteredMovements = useMemo(() => {
    if (!movementDate) return sectorMovements;
    return sectorMovements.filter(m => getLocalDateStr(m.moved_at) === movementDate);
  }, [sectorMovements, movementDate]);

  const inCount = useMemo(() => {
    return dateFilteredMovements.filter(m => isIncomingToSector(m, currentSectorId, currentSectorName)).length;
  }, [dateFilteredMovements, currentSectorId, currentSectorName]);

  const outCount = useMemo(() => {
    return dateFilteredMovements.filter(m => isOutgoingFromSector(m, currentSectorId, currentSectorName)).length;
  }, [dateFilteredMovements, currentSectorId, currentSectorName]);

  const filteredMovements = useMemo(() => {
    let list = dateFilteredMovements;
    if (movementFilterType === 'IN') list = list.filter(m => isIncomingToSector(m, currentSectorId, currentSectorName));
    else if (movementFilterType === 'OUT') list = list.filter(m => isOutgoingFromSector(m, currentSectorId, currentSectorName));
    if (movementSearch.trim()) list = list.filter(m => matchesMovementQuery(m, movementSearch));
    return list;
  }, [dateFilteredMovements, movementFilterType, movementSearch, currentSectorId, currentSectorName]);

  useEffect(() => { setMovementPage(1); }, [movementSearch, movementDate, movementFilterType]);

  const paginatedMovements = useMemo(() => {
    return filteredMovements.slice((movementPage - 1) * MOVEMENTS_PER_PAGE, movementPage * MOVEMENTS_PER_PAGE);
  }, [filteredMovements, movementPage]);

  const totalMovementPages = Math.max(1, Math.ceil(filteredMovements.length / MOVEMENTS_PER_PAGE));

  return {
    requisicoes, sectorMaterials, movements, liderInfo, loading, isProcessing,
    searchTerm, setSearchTerm, filteredMaterials,
    selectedForTransfer, setSelectedForTransfer, toggleSelectMaterial, selectAllMaterials,
    movementSearch, setMovementSearch, movementDate, setMovementDate,
    movementFilterType, setMovementFilterType, movementPage, setMovementPage,
    paginatedMovements, totalMovementPages, totalFilteredMovementsCount: filteredMovements.length,
    inCount, outCount, dateFilteredCount: dateFilteredMovements.length,
    selectedCompany, setSelectedCompany, selectedMaterial, setSelectedMaterial, selectedPhotos, setSelectedPhotos,
    isTransferModalOpen, setIsTransferModalOpen, isExitModalOpen, setIsExitModalOpen,
    isAcceptModalOpen, setIsAcceptModalOpen, itemToAccept, setItemToAccept,
    rejectModalTargetId, setRejectModalTargetId,
    loadData, fetchPendencias, fetchSectorMaterials, fetchMovements,
    handleApprove, handleReject, handleTransfer, handleMarkExit,
    handleAcceptClick, handleAcceptConfirm, handleRejectTransferClick, handleCancelTransferClick
  };
}
