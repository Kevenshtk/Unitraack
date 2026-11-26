import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { useConfirm } from '../../../components/common/ConfirmDialog';
import { superAdminService } from '../api/superAdminService';
import type {
  GlobalProfile,
  UserCategoryFilter,
  UserStatusFilter
} from '../components/superadmin/types';

export function useSuperAdminUsers() {
  const { user } = useAuth();
  const confirm = useConfirm();

  const [allUsers, setAllUsers] = useState<GlobalProfile[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedUserTenantId, setSelectedUserTenantId] = useState('');
  const [userCategoryFilter, setUserCategoryFilter] = useState<UserCategoryFilter>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<UserStatusFilter>('all');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
    );
  };

  const selectTenantForUsers = (tenantId: string) => {
    setSelectedUserTenantId(tenantId);
    setExpandedSections([]);
  };

  const filteredUsers = useMemo(() => {
    if (!selectedUserTenantId) return [];
    const tenantUsers = allUsers.filter(
      u => u.tenant?.id === selectedUserTenantId && u.role !== 'SUPER_ADMIN'
    );

    return tenantUsers.filter(u => {
      if (userSearchTerm.trim()) {
        const term = userSearchTerm.toLowerCase();
        const matches =
          u.full_name?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term) ||
          u.role?.toLowerCase().includes(term) ||
          u.sector?.toLowerCase().includes(term) ||
          u.cnpj?.includes(term) ||
          u.representative_name?.toLowerCase().includes(term);
        if (!matches) return false;
      }

      if (userCategoryFilter === 'internal' && u.role === 'TERCEIRIZADA') return false;
      if (userCategoryFilter === 'terceirizada' && u.role !== 'TERCEIRIZADA') return false;
      if (userStatusFilter === 'active' && u.is_active === false) return false;
      if (userStatusFilter === 'inactive' && u.is_active !== false) return false;

      return true;
    });
  }, [allUsers, selectedUserTenantId, userSearchTerm, userCategoryFilter, userStatusFilter]);

  const handleToggleUserStatus = async (userId: string, currentActive: boolean) => {
    const targetUser = allUsers.find(u => u.id === userId);
    const nextStatus = !currentActive;

    if (userId === user?.id && !nextStatus) {
      toast.warning('Ação Bloqueada', {
        description: 'Você não pode desativar seu próprio acesso de Super Administrador.'
      });
      return;
    }

    const isTerceirizada = targetUser?.role === 'TERCEIRIZADA';
    const entityLabel = isTerceirizada ? 'a empresa terceirizada' : 'o colaborador';

    const result = await confirm({
      title: nextStatus
        ? `Reativar ${isTerceirizada ? 'Empresa' : 'Colaborador'}`
        : `Desativar ${isTerceirizada ? 'Empresa' : 'Colaborador'}`,
      description: nextStatus
        ? `Deseja reativar o acesso de "${targetUser?.full_name || 'Usuário'}"? O acesso será restabelecido imediatamente.`
        : `Deseja realmente desativar o acesso de "${targetUser?.full_name || 'Usuário'}"? Ao ser desativado, ${entityLabel} não conseguirá realizar login até ser reativado.`,
      confirmText: nextStatus ? 'Sim, Reativar' : 'Sim, Desativar',
      cancelText: 'Cancelar',
      variant: nextStatus ? 'primary' : 'warning'
    });

    if (!result.isConfirmed) return;

    setUpdatingUserId(userId);
    try {
      await superAdminService.toggleUserStatus(userId, nextStatus);
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: nextStatus } : u));
      toast.success(nextStatus ? 'Acesso Reativado!' : 'Acesso Desativado!', {
        description: `O acesso de "${targetUser?.full_name}" foi ${nextStatus ? 'reativado' : 'desativado'} com sucesso.`
      });
    } catch (err: any) {
      toast.error('Erro na Operação', {
        description: err?.response?.data?.error || 'Erro ao alterar status do usuário.'
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  return {
    allUsers,
    setAllUsers,
    filteredUsers,
    userSearchTerm,
    setUserSearchTerm,
    selectedUserTenantId,
    setSelectedUserTenantId: selectTenantForUsers,
    userCategoryFilter,
    setUserCategoryFilter,
    userStatusFilter,
    setUserStatusFilter,
    expandedSections,
    toggleSection,
    updatingUserId,
    handleToggleUserStatus
  };
}
