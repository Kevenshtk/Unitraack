export type MaterialStatus =
  | 'PENDING'
  | 'IN_PLANTA'
  | 'OUT_PLANTA'
  | 'MOVING'
  | 'WAITING_EXIT'
  | 'EXIT_CONFERENCE';

export type ActiveTab = 'ENTRY' | 'EXIT' | 'IN_PLANTA';
export type EntrySubFilter = 'WAITING' | 'ARRIVED' | 'ANALYSIS';
export type ExitSubFilter = 'WAITING' | 'CONFERENCE';
export type MobileSection = 'list' | 'details' | 'history';
export type GateStatus =
  | 'WAITING_ARRIVAL'
  | 'ARRIVED'
  | 'IN_ANALYSIS'
  | 'WAITING_EXIT'
  | 'EXIT_CONFERENCE';

export interface Material {
  id: string;
  name: string;
  brand: string;
  model: string;
  serial_number: string;
  description: string;
  condition: string;
  code?: string;
  image_url?: string;
  status: MaterialStatus;
  photos?: string[];
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

export interface Requisicao {
  id: string;
  tenant_id: string;
  sector: string;
  entry_date: string;
  created_at: string;
  status: string;
  reason?: string;
  rejection_reason?: string;
  gate_checked_at?: string;
  driver_name?: string;
  plate?: string;
  profile: CompanyDetails;
  materials: Material[];
}

export interface ModalConfig {
  title: string;
  message: string;
  type: 'success' | 'error';
}

export const formatDateTime = (dateStr: string): { date: string; time: string } => {
  if (!dateStr) return { date: 'N/A', time: 'N/A' };
  try {
    const safeDateStr =
      !dateStr.includes('Z') && !dateStr.includes('+') && !dateStr.match(/-\d{2}:\d{2}$/)
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

