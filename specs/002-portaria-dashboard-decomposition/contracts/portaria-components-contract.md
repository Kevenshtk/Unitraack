# Contract: Custom Hooks e Subcomponentes da Portaria

**Feature**: `002-portaria-dashboard-decomposition`  
**Date**: 2026-11-06

---

## 1. Custom Hooks (`frontend/src/features/requests/hooks/`)

### 1.1 `useGatekeeperQueue(tenantId?: string)`
Gerencia o estado global de navegação, busca, filtros e listagens da Portaria.

```ts
export interface UseGatekeeperQueueReturn {
  requisicoes: Requisicao[];
  setRequisicoes: React.Dispatch<React.SetStateAction<Requisicao[]>>;
  filteredReqs: Requisicao[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selecionadoId: string | null;
  setSelecionadoId: (id: string | null) => void;
  selectedReq: Requisicao | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  entrySubFilter: EntrySubFilter;
  setEntrySubFilter: (filter: EntrySubFilter) => void;
  exitSubFilter: ExitSubFilter;
  setExitSubFilter: (filter: ExitSubFilter) => void;
  mobileSection: MobileSection;
  setMobileSection: (section: MobileSection) => void;
  auditHistory: any[];
  isHistoryPageOpen: boolean;
  setIsHistoryPageOpen: (open: boolean) => void;
  loadingHistory: boolean;
  selectedCompany: CompanyDetails | null;
  setSelectedCompany: (company: CompanyDetails | null) => void;
  fetchRequisicoes: () => Promise<void>;
  fetchAuditHistory: (id?: string) => Promise<void>;
}
```

---

### 1.2 `useGatekeeperRealtime(activeTab: ActiveTab, onRefresh: () => Promise<void> | void)`
Gerencia o polling de 30s e a subscrição Realtime do Supabase (`entry_requests` e `material_movements`).

```ts
export function useGatekeeperRealtime(
  activeTab: ActiveTab,
  onRefresh: () => Promise<void> | void
): void;
```

---

### 1.3 `useGatekeeperOperations(params: UseGatekeeperOperationsParams)`
Gerencia o estado volátil da operação e as ações de conferência física, fotos, divergência e cancelamento.

```ts
export interface UseGatekeeperOperationsParams {
  activeTab: ActiveTab;
  selecionadoId: string | null;
  setSelecionadoId: (id: string | null) => void;
  selectedReq: Requisicao | null;
  setRequisicoes: React.Dispatch<React.SetStateAction<Requisicao[]>>;
  setMobileSection: (section: MobileSection) => void;
  fetchRequisicoes: () => Promise<void>;
}

export interface UseGatekeeperOperationsReturn {
  processing: boolean;
  selectedMaterials: string[];
  setSelectedMaterials: React.Dispatch<React.SetStateAction<string[]>>;
  signature: string;
  setSignature: (sig: string) => void;
  photos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  observation: string;
  setObservation: (obs: string) => void;
  showDiscrepancyModal: boolean;
  setShowDiscrepancyModal: (open: boolean) => void;
  discrepancyReason: string;
  setDiscrepancyReason: (reason: string) => void;
  showSuccessModal: boolean;
  setShowSuccessModal: (open: boolean) => void;
  modalConfig: { title: string; message: string; type: 'success' | 'error' };
  isCameraOpen: boolean;
  setIsCameraOpen: (open: boolean) => void;
  detailMaterial: Material | null;
  setDetailMaterial: (mat: Material | null) => void;
  selectedPhotos: string[] | null;
  setSelectedPhotos: (photos: string[] | null) => void;
  handleUpdateGateStatus: (targetId: string, newStatus: GateStatus) => Promise<void>;
  handleToggleMaterial: (id: string) => void;
  handleCapturePhoto: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removePhoto: (index: number) => void;
  handleConfirmMovement: () => Promise<void>;
  handleCancelEntry: () => Promise<void>;
  handleNotifyDiscrepancy: () => Promise<void>;
}
```

---

## 2. Subcomponentes (`frontend/src/features/requests/components/portaria/`)

### 2.1 `GatekeeperHeader.tsx`
- **Props**:
  - `tenant: any`
  - `userProfile: any`
  - `isHistoryPageOpen: boolean`
  - `onToggleHistory: () => void`
  - `onSignOut: () => void`

### 2.2 `GatekeeperTabs.tsx`
- **Props**:
  - `activeTab: ActiveTab`
  - `onSelectTab: (tab: ActiveTab) => void`
  - `searchTerm: string`
  - `onSearchChange: (value: string) => void`
  - `entrySubFilter: EntrySubFilter`
  - `onEntrySubFilterChange: (filter: EntrySubFilter) => void`
  - `exitSubFilter: ExitSubFilter`
  - `onExitSubFilterChange: (filter: ExitSubFilter) => void`
  - `requisicoes: Requisicao[]`
  - `filteredReqs: Requisicao[]`
  - `loading: boolean`
  - `selecionadoId: string | null`
  - `onSelectRequest: (id: string) => void`
  - `hiddenOnMobile: boolean`

### 2.3 `GatekeeperEntryQueue.tsx`
- **Props**:
  - `selectedReq: Requisicao`
  - `processing: boolean`
  - `selectedMaterials: string[]`
  - `onToggleMaterial: (id: string) => void`
  - `onSetSelectedMaterials: (ids: string[]) => void`
  - `photos: string[]`
  - `onOpenCamera: () => void`
  - `onCapturePhoto: (e: React.ChangeEvent<HTMLInputElement>) => void`
  - `onRemovePhoto: (index: number) => void`
  - `observation: string`
  - `onObservationChange: (value: string) => void`
  - `signature: string`
  - `onSignatureChange: (value: string) => void`
  - `onUpdateGateStatus: (targetId: string, status: GateStatus) => void`
  - `onConfirmMovement: () => void`
  - `onOpenDiscrepancyModal: () => void`
  - `onCancelEntry: () => void`
  - `onBackToList: () => void`
  - `onSelectCompany: (company: CompanyDetails) => void`
  - `onViewPhotos: (photos: string[]) => void`
  - `onSelectMaterialDetail: (material: Material) => void`

### 2.4 `GatekeeperExitQueue.tsx`
- **Props**:
  - `selectedReq: Requisicao`
  - `processing: boolean`
  - `selectedMaterials: string[]`
  - `onToggleMaterial: (id: string) => void`
  - `onSetSelectedMaterials: (ids: string[]) => void`
  - `photos: string[]`
  - `onOpenCamera: () => void`
  - `onCapturePhoto: (e: React.ChangeEvent<HTMLInputElement>) => void`
  - `onRemovePhoto: (index: number) => void`
  - `observation: string`
  - `onObservationChange: (value: string) => void`
  - `signature: string`
  - `onSignatureChange: (value: string) => void`
  - `onUpdateGateStatus: (targetId: string, status: GateStatus) => void`
  - `onConfirmMovement: () => void`
  - `onOpenDiscrepancyModal: () => void`
  - `onBackToList: () => void`
  - `onSelectCompany: (company: CompanyDetails) => void`
  - `onViewPhotos: (photos: string[]) => void`
  - `onSelectMaterialDetail: (material: Material) => void`

### 2.5 `GatekeeperInPlantView.tsx`
- **Props**:
  - `selectedReq: Requisicao`
  - `onBackToList: () => void`
  - `onSelectCompany: (company: CompanyDetails) => void`
  - `onViewPhotos: (photos: string[]) => void`
  - `onSelectMaterialDetail: (material: Material) => void`

### 2.6 `GatekeeperDiscrepancyModal.tsx`
- **Props**:
  - `isOpen: boolean`
  - `discrepancyReason: string`
  - `processing: boolean`
  - `onReasonChange: (value: string) => void`
  - `onClose: () => void`
  - `onConfirm: () => void`

### 2.7 `GatekeeperModals.tsx`
- **Props**:
  - `detailMaterial: Material | null`
  - `onCloseDetailMaterial: () => void`
  - `selectedCompany: CompanyDetails | null`
  - `onCloseSelectedCompany: () => void`
  - `auditHistory: any[]`
  - `showSuccessModal: boolean`
  - `modalConfig: { title: string; message: string; type: 'success' | 'error' }`
  - `onCloseSuccessModal: () => void`
  - `selectedPhotos: string[] | null`
  - `onCloseSelectedPhotos: () => void`
  - `onViewPhotos: (photos: string[] | null) => void`

