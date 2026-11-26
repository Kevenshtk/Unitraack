import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useConfirm } from '../../../components/common/ConfirmDialog';
import { superAdminService } from '../api/superAdminService';
import {
  INITIAL_TENANT_FORM_DATA,
  type Tenant,
  type TenantFormData,
  type ExtractionFeedback
} from '../components/superadmin/types';

export interface UseSuperAdminTenantsParams {
  onRefreshAll: () => Promise<void>;
}

export function useSuperAdminTenants({ onRefreshAll }: UseSuperAdminTenantsParams) {
  const confirm = useConfirm();

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingTenantId, setUpdatingTenantId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<TenantFormData>(INITIAL_TENANT_FORM_DATA);
  const [generatedInvite, setGeneratedInvite] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const [websiteInput, setWebsiteInput] = useState('');
  const [isExtractingBranding, setIsExtractingBranding] = useState(false);
  const [detectedPalette, setDetectedPalette] = useState<string[]>([]);
  const [activeColorSlot, setActiveColorSlot] = useState<'primary' | 'secondary' | 'tertiary'>('primary');
  const [extractionFeedback, setExtractionFeedback] = useState<ExtractionFeedback | null>(null);

  const filteredTenants = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return tenants.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.cnpj.includes(searchTerm) ||
      t.subdomain?.toLowerCase().includes(q)
    );
  }, [tenants, searchTerm]);

  const resetModalState = () => {
    setEditingTenant(null);
    setFormData(INITIAL_TENANT_FORM_DATA);
    setWebsiteInput('');
    setDetectedPalette([]);
    setExtractionFeedback(null);
    setGeneratedInvite(null);
  };

  const openCreateModal = () => {
    resetModalState();
    setIsModalOpen(true);
  };

  const openEditModal = (t: Tenant) => {
    setEditingTenant(t);
    setFormData({
      tenantName: t.name,
      tenantCnpj: t.cnpj,
      logoUrl: t.logo_url || '',
      companyColor: t.company_color || '#00B5AD',
      secondaryColor: t.secondary_color || '#1996DC',
      tertiaryColor: t.tertiary_color || '#001D4A'
    });
    setWebsiteInput('');
    setDetectedPalette([]);
    setExtractionFeedback(null);
    setGeneratedInvite(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetModalState();
  };

  const handleAutoDetectBranding = async (urlToScan?: string) => {
    const url = (urlToScan || websiteInput || formData.logoUrl).trim();
    if (!url) {
      toast.info('URL Necessária', {
        description: 'Digite ou cole o link do site da usina para escanear a identidade visual.'
      });
      return;
    }

    setIsExtractingBranding(true);
    setExtractionFeedback(null);
    try {
      const res = await superAdminService.extractBranding(url);
      if (res.success && res.data) {
        const { suggestedName, logoUrl, primaryColor, secondaryColor, tertiaryColor, palette } = res.data;
        setFormData(prev => ({
          ...prev,
          tenantName: prev.tenantName ? prev.tenantName : (suggestedName || prev.tenantName),
          logoUrl: logoUrl || prev.logoUrl,
          companyColor: primaryColor || prev.companyColor || '#00B5AD',
          secondaryColor: secondaryColor || prev.secondaryColor || '#1996DC',
          tertiaryColor: tertiaryColor || prev.tertiaryColor || '#001D4A'
        }));
        if (palette && palette.length > 0) setDetectedPalette(palette);
        setExtractionFeedback({
          type: 'success',
          message: 'Identidade detectada com sucesso! 3 cores da paleta aplicadas.'
        });
      } else {
        setExtractionFeedback({
          type: 'error',
          message: res.error || 'Não foi possível extrair a identidade do site informado.'
        });
      }
    } catch (err: any) {
      setExtractionFeedback({
        type: 'error',
        message: err?.response?.data?.error || 'Falha de conexão ao tentar escanear o site.'
      });
    } finally {
      setIsExtractingBranding(false);
    }
  };

  const handleSubmitTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      if (editingTenant) {
        await superAdminService.updateTenant(editingTenant.id, {
          name: formData.tenantName,
          cnpj: formData.tenantCnpj,
          logo_url: formData.logoUrl,
          company_color: formData.companyColor,
          secondary_color: formData.secondaryColor,
          tertiary_color: formData.tertiaryColor
        });
        closeModal();
        toast.success('Usina Atualizada!', {
          description: 'Os dados da unidade foram atualizados com sucesso.'
        });
      } else {
        const data = await superAdminService.createTenant({
          tenantName: formData.tenantName,
          tenantCnpj: formData.tenantCnpj,
          logo_url: formData.logoUrl,
          company_color: formData.companyColor,
          secondary_color: formData.secondaryColor,
          tertiary_color: formData.tertiaryColor
        });
        if (data.inviteToken) {
          setGeneratedInvite(`${window.location.origin}/register-gestor?token=${data.inviteToken}`);
        } else {
          closeModal();
          toast.success('Usina Cadastrada!', {
            description: 'A nova unidade industrial foi cadastrada no sistema.'
          });
        }
      }
      await onRefreshAll();
    } catch (err: any) {
      toast.error('Erro ao Salvar Usina', {
        description: err?.response?.data?.error || 'Ocorreu um erro ao salvar a usina.'
      });
    } finally {
      setCreating(false);
    }
  };

  const handleCopyInviteLink = (token?: string) => {
    const link = token ? `${window.location.origin}/register-gestor?token=${token}` : generatedInvite;
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const generateAndCopyNewLink = async (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    try {
      const data = await superAdminService.generateTenantInvite({ tenantId });
      if (!data.inviteToken) {
        toast.error('Erro ao Gerar Convite', { description: 'Token de convite não retornado.' });
        return;
      }
      const link = `${window.location.origin}/register-gestor?token=${data.inviteToken}`;
      navigator.clipboard.writeText(link);
      toast.success('Convite Gerado & Copiado!', {
        description: `Link de auto-cadastro para "${tenant?.name || 'Usina'}" copiado para a área de transferência.`
      });
    } catch (err: any) {
      toast.error('Erro ao Gerar Convite', {
        description: err?.response?.data?.error || 'Não foi possível gerar o link de convite.'
      });
    }
  };

  const handleToggleTenantStatus = async (tenantId: string, currentActive: boolean) => {
    const targetTenant = tenants.find(t => t.id === tenantId);
    const nextStatus = !currentActive;

    const result = await confirm({
      title: currentActive ? 'Desativar Acesso da Usina' : 'Reativar Acesso da Usina',
      description: currentActive
        ? `Deseja realmente desativar o acesso da "${targetTenant?.name || 'Usina'}"? Colaboradores e gestores receberão aviso de sistema temporariamente desativado.`
        : `Deseja reativar o acesso da "${targetTenant?.name || 'Usina'}"? O portal ficará disponível imediatamente.`,
      confirmText: currentActive ? 'Sim, Desativar' : 'Sim, Reativar',
      cancelText: 'Cancelar',
      variant: currentActive ? 'warning' : 'primary'
    });

    if (!result.isConfirmed) return;

    setUpdatingTenantId(tenantId);
    try {
      await superAdminService.toggleTenantStatus(tenantId, nextStatus);
      setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, active: nextStatus } : t));
      toast.success(nextStatus ? 'Usina Reativada!' : 'Usina Desativada!', {
        description: `O status da unidade "${targetTenant?.name || 'Usina'}" foi alterado para ${nextStatus ? 'Ativa' : 'Desativada'}.`
      });
    } catch (err: any) {
      toast.error('Erro na Operação', {
        description: err?.response?.data?.error || 'Erro ao alterar status da usina.'
      });
    } finally {
      setUpdatingTenantId(null);
    }
  };

  const handleDeleteTenant = async (tenantId: string) => {
    const target = tenants.find(t => t.id === tenantId);

    const result = await confirm({
      title: 'Excluir Unidade Industrial',
      description: `Tem certeza que deseja excluir definitivamente a usina "${target?.name || 'Unidade'}"? Se houver usuários ou histórico vinculado, a exclusão será bloqueada.`,
      confirmText: 'Sim, Excluir Unidade',
      cancelText: 'Cancelar',
      variant: 'danger'
    });

    if (!result.isConfirmed) return;

    setUpdatingTenantId(tenantId);
    try {
      await superAdminService.deleteTenant(tenantId);
      toast.success('Usina Excluída!', {
        description: `A usina "${target?.name || 'Unidade'}" foi excluída com sucesso.`
      });
      await onRefreshAll();
    } catch (err: any) {
      toast.error('Não Foi Possível Excluir', {
        description: err?.response?.data?.error || 'Erro ao excluir unidade.'
      });
    } finally {
      setUpdatingTenantId(null);
    }
  };

  return {
    tenants, setTenants, filteredTenants, searchTerm, setSearchTerm, updatingTenantId,
    isModalOpen, editingTenant, creating, formData, setFormData,
    generatedInvite, copySuccess, websiteInput, setWebsiteInput,
    isExtractingBranding, detectedPalette, activeColorSlot, setActiveColorSlot,
    extractionFeedback, openCreateModal, openEditModal, closeModal,
    handleAutoDetectBranding, handleSubmitTenant, handleCopyInviteLink,
    generateAndCopyNewLink, handleToggleTenantStatus, handleDeleteTenant
  };
}
