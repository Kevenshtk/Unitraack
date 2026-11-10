# Component & Hook Contracts: 003-lider-dashboard-decomposition

**Feature**: `003-lider-dashboard-decomposition`  
**Date**: 2026-11-09  
**Parent**: [spec.md](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/003-lider-dashboard-decomposition/spec.md)  

---

## 1. Custom Hook Contracts

### `useLeaderOperations.ts`

```typescript
export interface UseLeaderOperationsParams {
  liderInfo: LiderInfo | null;
  profileSectorId?: string;
  profileSectorName?: string;
}

export interface UseLeaderOperationsReturn {
  // Dados principais
  requisicoes: Requisicao[];
  sectorMaterials: Material[];
  movements: MovementRecord[];
  liderInfo: LiderInfo | null;
  loading: boolean;
  isProcessing: boolean;

  // Busca e Filtros de Inventário
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredMaterials: Material[];

  // Seleção múltipla para saída/transferência
  selectedForTransfer: string[];
  setSelectedForTransfer: React.Dispatch<React.SetStateAction<string[]>>;
  toggleSelectMaterial: (id: string) => void;
  selectAllMaterials: (ids: string[]) => void;

  // Filtros e paginação do Histórico
  movementSearch: string;
  setMovementSearch: (term: string) => void;
  movementDate: string;
  setMovementDate: (date: string) => void;
  movementFilterType: MovementFilterType;
  setMovementFilterType: (type: MovementFilterType) => void;
  movementPage: number;
  setMovementPage: (page: number) => void;
  paginatedMovements: MovementRecord[];
  totalMovementPages: number;
  totalFilteredMovementsCount: number;

  // Modais de inspeção
  selectedCompany: CompanyDetails | null;
  setSelectedCompany: (company: CompanyDetails | null) => void;
  selectedMaterial: Material | null;
  setSelectedMaterial: (material: Material | null) => void;
  selectedPhotos: string[] | null;
  setSelectedPhotos: (photos: string[] | null) => void;

  // Modais de operação
  isTransferModalOpen: boolean;
  setIsTransferModalOpen: (open: boolean) => void;
  isExitModalOpen: boolean;
  setIsExitModalOpen: (open: boolean) => void;
  isAcceptModalOpen: boolean;
  setIsAcceptModalOpen: (open: boolean) => void;
  itemToAccept: { id: string; name: string } | null;
  setItemToAccept: (item: { id: string; name: string } | null) => void;
  rejectModalTargetId: string | null;
  setRejectModalTargetId: (id: string | null) => void;

  // Métodos de ação e recarga
  loadData: () => Promise<void>;
  fetchPendencias: () => Promise<void>;
  fetchSectorMaterials: () => Promise<void>;
  fetchMovements: () => Promise<void>;
  handleApprove: (requestId: string) => Promise<void>;
  handleReject: (requestId: string, reason?: string) => Promise<void>;
  handleTransfer: (toSectorId: string, signature: string, extraData?: any, photos?: string[]) => Promise<void>;
  handleMarkExit: (signature: string, extraData?: any, photos?: string[]) => Promise<void>;
  handleAcceptClick: (materialId: string, materialName: string) => void;
  handleAcceptConfirm: (signature: string, photos?: string[]) => Promise<void>;
  handleRejectTransferClick: (materialId: string) => Promise<void>;
  handleCancelTransferClick: (materialId: string) => Promise<void>;
}
```

---

### `useLeaderRealtime.ts`

```typescript
export interface UseLeaderRealtimeParams {
  onMaterialsChange: () => void | Promise<void>;
  onMovementsChange: () => void | Promise<void>;
  onRequestsChange: () => void | Promise<void>;
}

export function useLeaderRealtime(params: UseLeaderRealtimeParams): void;
```

---

## 2. Component Props Contracts

### `LeaderApprovalsView.tsx`

```typescript
export interface LeaderApprovalsViewProps {
  requisicoes: Requisicao[];
  loading: boolean;
  onApprove: (requestId: string) => void;
  onOpenRejectModal: (requestId: string) => void;
  onSelectCompany: (company: CompanyDetails) => void;
  onSelectMaterial: (material: Material) => void;
}
```

### `LeaderSectorInventoryView.tsx`

```typescript
export interface LeaderSectorInventoryViewProps {
  materials: Material[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedForTransfer: string[];
  onToggleSelectMaterial: (id: string) => void;
  onSelectAllMaterials: (ids: string[]) => void;
  onOpenTransferModal: () => void;
  onOpenExitModal: () => void;
  onSelectCompany: (company: CompanyDetails) => void;
  onSelectMaterial: (material: Material) => void;
}
```

### `LeaderMovementsView.tsx`

```typescript
export interface LeaderMovementsViewProps {
  materials: Material[];
  currentSectorId?: string;
  currentSectorName?: string;
  isProcessing: boolean;
  onAcceptClick: (materialId: string, materialName: string) => void;
  onRejectTransferClick: (materialId: string) => void;
  onCancelTransferClick: (materialId: string) => void;
  onSelectCompany: (company: CompanyDetails) => void;
  onSelectMaterial: (material: Material) => void;
}
```

### `LeaderHistoryView.tsx`

```typescript
export interface LeaderHistoryViewProps {
  paginatedMovements: MovementRecord[];
  totalFilteredCount: number;
  movementSearch: string;
  onMovementSearchChange: (value: string) => void;
  movementDate: string;
  onMovementDateChange: (value: string) => void;
  movementFilterType: MovementFilterType;
  onMovementFilterTypeChange: (type: MovementFilterType) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  currentSectorId?: string;
  currentSectorName?: string;
  onViewPhotos: (photos: string[]) => void;
  onSelectMaterial: (material: Material) => void;
}
```

### `LeaderRejectReasonModal.tsx`

```typescript
export interface LeaderRejectReasonModalProps {
  isOpen: boolean;
  targetId: string | null;
  isProcessing: boolean;
  onClose: () => void;
  onConfirmReject: (requestId: string, reason: string) => Promise<void> | void;
}
```

### `LeaderModals.tsx`

Agrupa os modais auxiliares de visualização já existentes para simplificar o container:
```typescript
export interface LeaderModalsProps {
  selectedCompany: CompanyDetails | null;
  onCloseCompany: () => void;
  selectedMaterial: Material | null;
  onCloseMaterial: () => void;
  selectedPhotos: string[] | null;
  onClosePhotos: () => void;
}
```

