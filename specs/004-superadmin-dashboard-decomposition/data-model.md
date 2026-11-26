# Data Model & Domain Interfaces: 004-superadmin-dashboard-decomposition

**Feature**: `004-superadmin-dashboard-decomposition`  
**Date**: 2026-11-25  
**Parent**: [spec.md](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/004-superadmin-dashboard-decomposition/spec.md)

---

## 1. Domain Entities (`components/superadmin/types.ts`)

```typescript
export type SuperAdminTab = 'dashboard' | 'tenants' | 'users' | 'monitoring';

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
```

---

## 2. API Service Payloads (`api/superAdminService.ts`)

```typescript
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
  inviteToken: string;
  [key: string]: unknown;
}

export interface ExtractBrandingResponse {
  success: boolean;
  data?: BrandingExtractionData;
  error?: string;
}

export interface AuditResponse {
  success: boolean;
  data: AuditLog[];
}
```
