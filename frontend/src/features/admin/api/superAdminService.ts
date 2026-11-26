import { api } from '../../../lib/axios';
import type {
  Tenant,
  PlatformStats,
  GlobalProfile,
  AuditLog,
  CreateTenantPayload,
  UpdateTenantPayload,
  GenerateInvitePayload,
  InviteResponse,
  ExtractBrandingResponse
} from '../components/superadmin/types';

export const superAdminService = {
  /** Busca métricas consolidadas da plataforma */
  async getPlatformStats(): Promise<PlatformStats> {
    const response = await api.get<PlatformStats>('/admin/stats');
    return response.data;
  },

  /** Lista todas as usinas (tenants) cadastradas */
  async listTenants(): Promise<Tenant[]> {
    const response = await api.get<Tenant[]>('/admin/tenants');
    return Array.isArray(response.data) ? response.data : [];
  },

  /** Cria nova usina e retorna token de convite do primeiro gestor */
  async createTenant(payload: CreateTenantPayload): Promise<InviteResponse & Partial<Tenant>> {
    const response = await api.post<InviteResponse & Partial<Tenant>>('/admin/tenants', payload);
    return response.data;
  },

  /** Atualiza dados cadastrais e identidade visual de uma usina */
  async updateTenant(id: string, payload: UpdateTenantPayload): Promise<Tenant> {
    const response = await api.put<Tenant>(`/admin/tenants/${id}`, payload);
    return response.data;
  },

  /** Ativa ou desativa o acesso de uma usina */
  async toggleTenantStatus(id: string, isActive: boolean): Promise<void> {
    await api.patch(`/admin/tenants/${id}/status`, { active: isActive });
  },

  /** Exclui definitivamente uma usina sem histórico vinculado */
  async deleteTenant(id: string): Promise<void> {
    await api.delete(`/admin/tenants/${id}`);
  },

  /** Gera novo link/token de convite para Gestor de Segurança de uma usina */
  async generateTenantInvite(payload: GenerateInvitePayload): Promise<InviteResponse> {
    const response = await api.post<InviteResponse>('/admin/tenants/invite', payload);
    return response.data;
  },

  /** Extrai automaticamente logotipo e paleta de 3 cores a partir da URL da usina */
  async extractBranding(url: string): Promise<ExtractBrandingResponse> {
    const response = await api.post<ExtractBrandingResponse>('/admin/extract-branding', { url });
    return response.data;
  },

  /** Lista globalmente todos os perfis cadastrados na plataforma */
  async listAllUsers(): Promise<GlobalProfile[]> {
    const response = await api.get<GlobalProfile[]>('/admin/users');
    return Array.isArray(response.data) ? response.data : [];
  },

  /** Alterna o status ativo/inativo de uma conta de usuário ou terceirizada */
  async toggleUserStatus(id: string, isActive: boolean): Promise<void> {
    await api.patch(`/admin/users/${id}/status`, { is_active: isActive });
  },

  /** Consulta os logs de movimentações de auditoria de uma usina */
  async getTenantAudit(tenantId: string): Promise<AuditLog[]> {
    const response = await api.get<{ success?: boolean; data?: AuditLog[] }>(`/admin/audit/${tenantId}`);
    if (response.data?.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return Array.isArray(response.data) ? (response.data as AuditLog[]) : [];
  }
};
