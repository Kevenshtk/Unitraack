export type SuperAdminTab = 'dashboard' | 'tenants' | 'users' | 'monitoring';

export const SUPER_ADMIN_HEADER_TITLES: Record<SuperAdminTab, string> = {
  dashboard: 'Início / Painel',
  tenants: 'Gerenciar Usinas · Unidades Federadas',
  users: 'Gerenciamento de Usuários · Acessos e Permissões',
  monitoring: 'Auditoria & Rastro Global'
};

export type UserCategoryFilter = 'all' | 'internal' | 'terceirizada';
export type UserStatusFilter = 'all' | 'active' | 'inactive';

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  cnpj: string;
  logo_url?: string;
  company_color?: string;
  secondary_color?: string;
  tertiary_color?: string;
  active?: boolean;
  created_at: string;
  gestores?: { count: number }[];
}

export interface PlatformStats {
  totalTenants: number;
  totalUsers: number;
  totalRequests: number;
}

export interface GlobalProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  sector?: string;
  cnpj?: string;
  representative_name?: string;
  phone?: string;
  registration_number?: string;
  is_active?: boolean;
  created_at: string;
  tenant?: {
    id: string;
    name: string;
    subdomain?: string;
    active?: boolean;
  };
}

export interface AuditLog {
  id: string;
  moved_at: string;
  type?: string;
  signature?: string | null;
  observation?: string | null;
  from_sector?: { id?: string; name: string } | null;
  to_sector?: { id?: string; name: string } | null;
  actor?: { full_name: string; registration_number?: string } | null;
  material?: {
    id?: string;
    name: string;
    serial_number?: string;
    request?: {
      profile?: { full_name: string };
    };
  } | null;
}

export interface TenantFormData {
  tenantName: string;
  tenantCnpj: string;
  logoUrl: string;
  companyColor: string;
  secondaryColor: string;
  tertiaryColor: string;
}

export const INITIAL_TENANT_FORM_DATA: TenantFormData = {
  tenantName: '',
  tenantCnpj: '',
  logoUrl: '',
  companyColor: '#00B5AD',
  secondaryColor: '#1996DC',
  tertiaryColor: '#001D4A'
};

export interface BrandingExtractionData {
  suggestedName?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  palette?: string[];
}

export interface ExtractionFeedback {
  type: 'success' | 'error';
  message: string;
}

export interface CreateTenantPayload {
  tenantName: string;
  tenantCnpj: string;
  logo_url?: string;
  company_color?: string;
  secondary_color?: string;
  tertiary_color?: string;
}

export interface UpdateTenantPayload {
  name: string;
  cnpj: string;
  logo_url?: string;
  company_color?: string;
  secondary_color?: string;
  tertiary_color?: string;
}

export interface GenerateInvitePayload {
  tenantId: string;
}

export interface InviteResponse {
  inviteToken?: string;
  [key: string]: unknown;
}

export interface ExtractBrandingResponse {
  success: boolean;
  data?: BrandingExtractionData;
  error?: string;
}
