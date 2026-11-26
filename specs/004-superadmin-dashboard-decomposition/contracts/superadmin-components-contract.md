# Component & Hook Contracts: 004-superadmin-dashboard-decomposition

**Feature**: `004-superadmin-dashboard-decomposition`  
**Date**: 2026-11-25  
**Parent**: [spec.md](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/004-superadmin-dashboard-decomposition/spec.md)

---

## 1. API Service Contract (`api/superAdminService.ts`)

```typescript
export const superAdminService = {
  getPlatformStats(): Promise<PlatformStats>;
  listTenants(): Promise<Tenant[]>;
  createTenant(payload: CreateTenantPayload): Promise<InviteResponse & Tenant>;
  updateTenant(id: string, payload: UpdateTenantPayload): Promise<Tenant>;
  toggleTenantStatus(id: string, isActive: boolean): Promise<void>;
  deleteTenant(id: string): Promise<void>;
  generateTenantInvite(payload: GenerateInvitePayload): Promise<InviteResponse>;
  extractBranding(url: string): Promise<ExtractBrandingResponse>;
  listAllUsers(): Promise<GlobalProfile[]>;
  toggleUserStatus(id: string, isActive: boolean): Promise<void>;
  getTenantAudit(tenantId: string): Promise<AuditLog[]>;
};
```

---

## 2. Custom Hook Contracts

### `useSuperAdminTenants.ts`

```typescript
export interface UseSuperAdminTenantsParams {
  onRefreshAll: () => Promise<void>;
}

export interface UseSuperAdminTenantsReturn {
  tenants: Tenant[];
  setTenants: React.Dispatch<React.SetStateAction<Tenant[]>>;
  filteredTenants: Tenant[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  expandedTenants: string[];
  toggleTenantExpanded: (tenantId: string) => void;
  updatingTenantId: string | null;

  // Modal e formulário
  isModalOpen: boolean;
  editingTenant: Tenant | null;
  creating: boolean;
  formData: TenantFormData;
  setFormData: React.Dispatch<React.SetStateAction<TenantFormData>>;
  generatedInvite: string | null;
  copySuccess: boolean;
  websiteInput: string;
  setWebsiteInput: (url: string) => void;
  isExtractingBranding: boolean;
  detectedPalette: string[];
  activeColorSlot: 'primary' | 'secondary' | 'tertiary';
  setActiveColorSlot: (slot: 'primary' | 'secondary' | 'tertiary') => void;
  extractionFeedback: ExtractionFeedback | null;

  // Ações
  openCreateModal: () => void;
  openEditModal: (tenant: Tenant) => void;
  closeModal: () => void;
  handleAutoDetectBranding: (urlToScan?: string) => Promise<void>;
  handleSubmitTenant: (e: React.FormEvent) => Promise<void>;
  handleCopyInviteLink: (token?: string) => void;
  generateAndCopyNewLink: (tenantId: string) => Promise<void>;
  handleToggleTenantStatus: (tenantId: string, currentActive: boolean) => void;
  handleDeleteTenant: (tenantId: string) => void;
}
```

### `useSuperAdminUsers.ts`

```typescript
export interface UseSuperAdminUsersReturn {
  allUsers: GlobalProfile[];
  setAllUsers: React.Dispatch<React.SetStateAction<GlobalProfile[]>>;
  filteredUsers: GlobalProfile[];
  userSearchTerm: string;
  setUserSearchTerm: (term: string) => void;
  selectedUserTenantId: string;
  setSelectedUserTenantId: (tenantId: string) => void;
  userCategoryFilter: UserCategoryFilter;
  setUserCategoryFilter: (cat: UserCategoryFilter) => void;
  userStatusFilter: UserStatusFilter;
  setUserStatusFilter: (status: UserStatusFilter) => void;
  expandedSections: string[];
  toggleSection: (sectionId: string) => void;
  updatingUserId: string | null;
  handleToggleUserStatus: (userId: string, currentActive: boolean) => void;
}
```

### `useSuperAdminStats.ts`

```typescript
export interface UseSuperAdminStatsReturn {
  stats: PlatformStats | null;
  setStats: React.Dispatch<React.SetStateAction<PlatformStats | null>>;
  selectedMonitoringTenant: string;
  setSelectedMonitoringTenant: (tenantId: string) => void;
  auditLogs: AuditLog[];
  loadingLogs: boolean;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
  paginatedLogs: AuditLog[];
  totalAuditPages: number;
  fetchAuditLogs: (tenantId: string) => Promise<void>;
}
```

---

## 3. Component Props Contracts

### `PlatformStatsCards.tsx`

```typescript
export interface PlatformStatsCardsProps {
  stats: PlatformStats | null;
  recentTenants: Tenant[];
  onNavigateTab: (tab: SuperAdminTab) => void;
  onOpenCreateTenant: () => void;
}
```

### `TenantsManagementView.tsx`

```typescript
export interface TenantsManagementViewProps {
  tenants: Tenant[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  expandedTenants: string[];
  onToggleExpand: (tenantId: string) => void;
  updatingTenantId: string | null;
  onOpenCreate: () => void;
  onOpenEdit: (tenant: Tenant) => void;
  onGenerateInvite: (tenantId: string) => void;
  onToggleStatus: (tenantId: string, currentActive: boolean) => void;
  onDeleteTenant: (tenantId: string) => void;
  onInspectAudit: (tenantId: string) => void;
}
```

### `TenantFormModal.tsx`

```typescript
export interface TenantFormModalProps {
  isOpen: boolean;
  editingTenant: Tenant | null;
  creating: boolean;
  formData: TenantFormData;
  setFormData: React.Dispatch<React.SetStateAction<TenantFormData>>;
  generatedInvite: string | null;
  copySuccess: boolean;
  websiteInput: string;
  onWebsiteInputChange: (url: string) => void;
  isExtractingBranding: boolean;
  detectedPalette: string[];
  activeColorSlot: 'primary' | 'secondary' | 'tertiary';
  onActiveColorSlotChange: (slot: 'primary' | 'secondary' | 'tertiary') => void;
  extractionFeedback: ExtractionFeedback | null;
  onAutoDetectBranding: (urlToScan?: string) => void;
  onCopyInviteLink: (token?: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}
```

### `GlobalUsersView.tsx`

```typescript
export interface GlobalUsersViewProps {
  users: GlobalProfile[];
  tenants: Tenant[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedTenantId: string;
  onSelectTenant: (tenantId: string) => void;
  categoryFilter: UserCategoryFilter;
  onCategoryFilterChange: (filter: UserCategoryFilter) => void;
  statusFilter: UserStatusFilter;
  onStatusFilterChange: (filter: UserStatusFilter) => void;
  expandedSections: string[];
  onToggleSection: (sectionId: string) => void;
  updatingUserId: string | null;
  onToggleUserStatus: (userId: string, currentActive: boolean) => void;
}
```

### `TenantAuditView.tsx`

```typescript
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
  onRefresh: () => void;
}
```
