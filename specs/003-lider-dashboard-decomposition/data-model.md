# Data Model & Domain Interfaces: 003-lider-dashboard-decomposition

**Feature**: `003-lider-dashboard-decomposition`  
**Date**: 2026-11-09  
**Parent**: [spec.md](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/003-lider-dashboard-decomposition/spec.md)  

---

## 1. Domain Entities & Interfaces (`components/lider/types.ts`)

```typescript
export type MaterialStatus =
  | 'PENDING'
  | 'IN_PLANTA'
  | 'OUT_PLANTA'
  | 'MOVING'
  | 'WAITING_EXIT';

export interface MovementRecord {
  id: string;
  moved_at: string;
  photos?: string[] | null;
  signature?: string | null;
  observation?: string | null;
  from_sector?: { id: string; name: string } | null;
  to_sector?: { id: string; name: string } | null;
  actor?: { full_name: string; registration_number?: string } | null;
  material?: {
    id: string;
    name: string;
    status: MaterialStatus;
    serial_number?: string;
    request?: { sector?: string };
  };
}

export interface Material {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  image_url?: string;
  code?: string;
  serial_number?: string;
  description?: string;
  condition: string;
  status: MaterialStatus;
  entry_at?: string;
  exit_at?: string;
  current_sector_id?: string;
  pending_sector_id?: string;
  request?: {
    id: string;
    sector: string;
    entry_date: string;
    driver_name?: string;
    plate?: string;
    profile?: CompanyDetails;
  };
  movements?: MovementRecord[];
}

export interface Requisicao {
  id: string;
  sector: string;
  entry_date: string;
  status?: string;
  rejection_reason?: string;
  reason?: string;
  driver_name?: string;
  plate?: string;
  profile: CompanyDetails;
  materials: Material[];
}

export interface CompanyDetails {
  id?: string;
  full_name: string;
  representative_name?: string;
  phone?: string;
  cnpj?: string;
  logo_url?: string;
  theme_color?: string;
}

export interface LiderInfo {
  full_name: string;
  sector: string;
  sector_id?: string;
}

export type LeaderActiveSection =
  | 'approvals'
  | 'materials'
  | 'movements'
  | 'history';

export type MovementFilterType = 'ALL' | 'IN' | 'OUT';
```

---

## 2. API Service Contracts (`api/leaderService.ts`)

```typescript
export interface LeaderTransferPayload {
  materialIds: string[];
  toSectorId: string;
  signature: string;
  photos?: string[];
  observation?: string;
}

export interface LeaderExitPayload {
  materialIds: string[];
  signature: string;
  photos?: string[];
  observation?: string;
}

export interface LeaderAcceptPayload {
  materialIds: string[];
  signature: string;
  photos?: string[];
}

export interface LeaderRejectTransferPayload {
  materialIds: string[];
  reason: string;
}

export interface LeaderReviewPayload {
  acao: 'APPROVE' | 'REJECT';
  reason?: string;
}
```

---

## 3. Date & Text Formatting Utilities

```typescript
export const getLocalDateStr = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const safeDateStr = !dateStr.includes('Z') && !dateStr.includes('+') && !dateStr.match(/-\d{2}:\d{2}$/)
      ? `${dateStr}Z`
      : dateStr;
    const d = new Date(safeDateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

export const formatDateTime = (dateStr: string): { date: string; time: string } => {
  if (!dateStr) return { date: 'N/A', time: 'N/A' };
  try {
    const safeDateStr = !dateStr.includes('Z') && !dateStr.includes('+') && !dateStr.match(/-\d{2}:\d{2}$/)
      ? `${dateStr}Z`
      : dateStr;
    const d = new Date(safeDateStr);
    return {
      date: d.toLocaleDateString('pt-BR'),
      time: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  } catch {
    return { date: 'Data Inválida', time: '--:--' };
  }
};
```

