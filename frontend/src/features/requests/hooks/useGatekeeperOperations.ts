import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useConfirm } from '../../../components/common/ConfirmDialog';
import { gatekeeperService } from '../api/gatekeeperService';
import { compressImage } from '../../../utils/imageCompressor';
import type {
  ActiveTab,
  GateStatus,
  Material,
  MobileSection,
  ModalConfig,
  Requisicao
} from '../components/portaria/types';

export interface UseGatekeeperOperationsParams {
  activeTab: ActiveTab;
  selecionadoId: string | null;
  setSelecionadoId: (id: string | null) => void;
  selectedReq: Requisicao | null;
  setRequisicoes: React.Dispatch<React.SetStateAction<Requisicao[]>>;
  setMobileSection: (section: MobileSection) => void;
  fetchRequisicoes: () => Promise<void>;
}

export function useGatekeeperOperations({
  activeTab,
  selecionadoId,
  setSelecionadoId,
  selectedReq,
  setRequisicoes,
  setMobileSection,
  fetchRequisicoes
}: UseGatekeeperOperationsParams) {
  const confirm = useConfirm();
  const [processing, setProcessing] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [detailMaterial, setDetailMaterial] = useState<Material | null>(null);
  const [showDiscrepancyModal, setShowDiscrepancyModal] = useState(false);
  const [discrepancyReason, setDiscrepancyReason] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    title: '',
    message: '',
    type: 'success'
  });
  const [signature, setSignature] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[] | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [observation, setObservation] = useState('');

  // Reinicializa seleção de itens e fotos ao trocar de aba
  useEffect(() => {
    setSelectedMaterials([]);
    setPhotos([]);
  }, [activeTab]);

  // Pré-seleciona materiais elegíveis ao selecionar uma requisição
  useEffect(() => {
    if (selectedReq) {
      const initial = selectedReq.materials
        .filter(m =>
          activeTab === 'ENTRY'
            ? m.status !== 'IN_PLANTA'
            : ['WAITING_EXIT', 'EXIT_CONFERENCE'].includes(m.status)
        )
        .map(m => m.id);
      setSelectedMaterials(initial);
    }
  }, [selecionadoId, selectedReq, activeTab]);

  const handleToggleMaterial = (id: string) => {
    setSelectedMaterials(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleCapturePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setPhotos(prev => [...prev, compressed]);
      } catch (err) {
        console.error('Erro ao comprimir imagem:', err);
      }
    }
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateGateStatus = async (targetId: string, newStatus: GateStatus) => {
    setProcessing(true);
    try {
      await gatekeeperService.updateGateStatus(targetId, newStatus);
      setRequisicoes(prev => prev.map(r => (r.id === targetId ? { ...r, status: newStatus } : r)));
      const statusLabel =
        newStatus === 'ARRIVED'
          ? 'Chegada Registrada'
          : newStatus === 'IN_ANALYSIS'
          ? 'Em Análise'
          : newStatus === 'WAITING_ARRIVAL'
          ? 'Aguardando Chegada'
          : newStatus === 'EXIT_CONFERENCE'
          ? 'Conferência de Saída Iniciada'
          : newStatus === 'WAITING_EXIT'
          ? 'Aguardando Saída'
          : newStatus;
      toast.success(statusLabel, {
        description: `O status da solicitação foi alterado para "${statusLabel}". Notificações enviadas aos gestores e líderes.`
      });
      fetchRequisicoes();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error;
      if (errorMsg) {
        toast.error('Erro', { description: errorMsg });
      } else {
        toast.error('Erro de Conexão', {
          description: 'Não foi possível conectar com o servidor.'
        });
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmMovement = async () => {
    if (!selecionadoId || selectedMaterials.length === 0) return;
    const cleanSignature = signature.trim().toUpperCase();
    if (!cleanSignature) {
      setModalConfig({
        title: 'Matrícula Obrigatória',
        message: 'Por favor, insira o número de matrícula para autorizar a operação.',
        type: 'error'
      });
      setShowSuccessModal(true);
      return;
    }

    // Se houver divergência apontada, confirmação explícita antes de liberar
    if (activeTab === 'ENTRY' && selectedReq?.status === 'DISCREPANCY') {
      const discReason =
        selectedReq.rejection_reason ||
        selectedReq.reason ||
        'Divergência apontada na conferência de itens';
      const result = await confirm({
        title: 'Liberar com Divergência?',
        description: `Esta solicitação possui uma divergência registrada ("${discReason}"). Deseja realmente autorizar a entrada do veículo e materiais na planta?`,
        variant: 'warning',
        confirmText: 'Sim, Liberar Entrada',
        cancelText: 'Voltar e Revisar'
      });
      if (!result.isConfirmed) return;
    }

    setProcessing(true);
    try {
      const payload = await gatekeeperService.confirmMovement(selecionadoId, {
        materialIds: selectedMaterials,
        type: activeTab,
        signature: cleanSignature,
        photos: photos.length > 0 ? photos : undefined,
        observation: observation ? observation : undefined
      });

      setRequisicoes(prev => prev.filter(r => r.id !== selecionadoId));
      setSelecionadoId(null);
      setMobileSection('list');
      setPhotos([]);
      setObservation('');
      setSignature('');
      setModalConfig({
        title: activeTab === 'ENTRY' ? 'Entrada Confirmada' : 'Saída Confirmada',
        message:
          payload?.data?.message ||
          payload?.message ||
          `O protocolo de ${
            activeTab === 'ENTRY' ? 'entrada' : 'saída'
          } foi processado com sucesso e registrado no histórico.`,
        type: 'success'
      });
      setShowSuccessModal(true);
      fetchRequisicoes();
    } catch (err: any) {
      if (err.response) {
        const errorMsg =
          err.response.data?.error ||
          err.response.data?.message ||
          'Matrícula inválida! A matrícula informada não foi encontrada ou não possui autorização ativa.';
        setModalConfig({
          title: 'Matrícula Inválida',
          message: errorMsg,
          type: 'error'
        });
      } else {
        setModalConfig({
          title: 'Erro de Conexão',
          message: 'Não foi possível estabelecer comunicação com o servidor de segurança.',
          type: 'error'
        });
      }
      setShowSuccessModal(true);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelEntry = async () => {
    if (!selecionadoId) return;

    const defaultCancelReason =
      selectedReq?.status === 'DISCREPANCY'
        ? `Cancelado pela Portaria devido a divergência: ${
            selectedReq.rejection_reason || selectedReq.reason || 'Itens em desacordo'
          }`
        : 'Cancelado pela Portaria: Não compareceu na data/prazo estimado';

    const result = await confirm({
      title: 'Cancelar Entrada?',
      description:
        selectedReq?.status === 'DISCREPANCY'
          ? 'Confirme o cancelamento e recusa da entrada para esta solicitação com divergência.'
          : 'Informe o motivo do cancelamento da entrada.',
      variant: 'danger',
      confirmText: 'Sim, Cancelar Entrada',
      cancelText: 'Voltar',
      inputConfig: {
        type: 'text',
        required: true,
        defaultValue: defaultCancelReason,
        errorMessage: 'Você precisa informar o motivo!'
      }
    });

    if (result.isConfirmed && result.value) {
      setProcessing(true);
      try {
        await gatekeeperService.cancelEntry(selecionadoId, result.value);
        setRequisicoes(prev => prev.filter(r => r.id !== selecionadoId));
        setSelecionadoId(null);
        setMobileSection('list');
        toast.success('Cancelado!', { description: 'A entrada foi cancelada com sucesso.' });
        fetchRequisicoes();
      } catch (err: any) {
        if (err.response) {
          toast.error('Erro', {
            description:
              err.response.data?.error ||
              err.response.data?.message ||
              'Ocorreu um erro ao cancelar a entrada.'
          });
        } else {
          toast.error('Erro', { description: 'Não foi possível comunicar com o servidor.' });
        }
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleNotifyDiscrepancy = async () => {
    if (!selecionadoId || !discrepancyReason) return;

    setProcessing(true);
    try {
      await gatekeeperService.notifyDiscrepancy(selecionadoId, discrepancyReason);
      setRequisicoes(prev =>
        prev.map(r =>
          r.id === selecionadoId ? { ...r, status: 'DISCREPANCY', reason: discrepancyReason } : r
        )
      );
      setShowDiscrepancyModal(false);
      setDiscrepancyReason('');
      setModalConfig({
        title: 'Divergência Registrada',
        message:
          'Divergência gravada com sucesso e notificada ao Gestor de Segurança. O registro fica ativo para auditoria e a entrada pode ser liberada normalmente após a conferência dos itens.',
        type: 'success'
      });
      setShowSuccessModal(true);
      fetchRequisicoes();
    } catch {
      setModalConfig({
        title: 'Falha ao Notificar',
        message: 'Erro ao registrar divergência no servidor.',
        type: 'error'
      });
      setShowSuccessModal(true);
    } finally {
      setProcessing(false);
    }
  };

  return {
    processing,
    selectedMaterials,
    setSelectedMaterials,
    detailMaterial,
    setDetailMaterial,
    showDiscrepancyModal,
    setShowDiscrepancyModal,
    discrepancyReason,
    setDiscrepancyReason,
    showSuccessModal,
    setShowSuccessModal,
    modalConfig,
    signature,
    setSignature,
    photos,
    setPhotos,
    selectedPhotos,
    setSelectedPhotos,
    isCameraOpen,
    setIsCameraOpen,
    observation,
    setObservation,
    handleUpdateGateStatus,
    handleToggleMaterial,
    handleCapturePhoto,
    removePhoto,
    handleConfirmMovement,
    handleCancelEntry,
    handleNotifyDiscrepancy
  };
}

