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
  from_sector_id?: string | null;
  to_sector_id?: string | null;
  from_sector?: { id: string; name: string } | null;
  to_sector?: { id: string; name: string } | null;
  actor?: { full_name: string; registration_number?: string } | null;
  material?: {
    id: string;
    name: string;
    status?: MaterialStatus;
    serial_number?: string;
    code?: string;
    request?: {
      sector?: string;
      rejection_reason?: string;
      reason?: string;
      status?: string;
      profile?: CompanyDetails;
    };
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
    id?: string;
    sector?: string;
    entry_date?: string;
    status?: string;
    rejection_reason?: string;
    reason?: string;
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
  | 'my-sector'
  | 'movements'
  | 'history'
  | string;

export type MovementFilterType = 'ALL' | 'IN' | 'OUT';

// Payload interfaces for Leader API calls
export interface LeaderTransferPayload {
  materialIds: string[];
  toSectorId: string;
  signature: string;
  photos?: string[];
  observation?: string;
  [key: string]: any;
}

export interface LeaderExitPayload {
  materialIds: string[];
  signature: string;
  photos?: string[];
  observation?: string;
  [key: string]: any;
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

// Formatting utilities
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

export const getTodayStr = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

export const toTitleCase = (str?: string): string => {
  if (!str) return '';
  return str
    .trim()
    .split(/\s+/)
    .map(word => {
      if (word.length <= 2 && ['de', 'da', 'do', 'das', 'dos', 'em', 'e'].includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

export const getDestinationSectorName = (move: any): string => {
  if (!move.to_sector?.name) return 'SAÍDA';
  const name = (move.to_sector.name || '').toUpperCase();
  const obs = (move.observation || '').toLowerCase();
  const matStatus = move.material?.status;
  if (name === 'PORTARIA' && (obs.includes('saída') || obs.includes('baixa') || matStatus === 'OUT_PLANTA' || matStatus === 'WAITING_EXIT')) {
    return 'SAÍDA';
  }
  return move.to_sector.name;
};

export const isIncomingToSector = (move: any, currentSectorId?: string, currentSectorName?: string): boolean => {
  if (currentSectorId && move.to_sector_id === currentSectorId) return true;
  const destName = (move.to_sector?.name || '').trim().toLowerCase();
  if (currentSectorName && destName && (destName === currentSectorName || destName.includes(currentSectorName) || currentSectorName.includes(destName))) return true;
  const origName = (move.from_sector?.name || '').trim().toLowerCase();
  const reqSector = (move.material?.request?.sector || '').trim().toLowerCase();
  return Boolean((!origName || origName === 'entrada' || origName === 'portaria') && currentSectorName && reqSector &&
    (reqSector === currentSectorName || reqSector.includes(currentSectorName) || currentSectorName.includes(reqSector)));
};

export const isOutgoingFromSector = (move: any, currentSectorId?: string, currentSectorName?: string): boolean => {
  if (currentSectorId && move.from_sector_id === currentSectorId) return true;
  const origName = (move.from_sector?.name || '').trim().toLowerCase();
  return Boolean(currentSectorName && origName && (origName === currentSectorName || origName.includes(currentSectorName) || currentSectorName.includes(origName)));
};

export const isRelatedToSector = (move: any, currentSectorId?: string, currentSectorName?: string): boolean => {
  if (!currentSectorId && !currentSectorName) return true;
  return isIncomingToSector(move, currentSectorId, currentSectorName) || isOutgoingFromSector(move, currentSectorId, currentSectorName);
};

export const matchesMovementQuery = (move: any, query: string): boolean => {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  const matName = (move.material?.name || '').toLowerCase();
  const matSerial = (move.material?.serial_number || move.material?.code || '').toLowerCase();
  const compName = (move.material?.request?.profile?.full_name || '').toLowerCase();
  const actorName = (move.actor?.full_name || '').toLowerCase();
  const actorReg = (move.actor?.registration_number || '').toLowerCase();
  const fromName = (move.from_sector?.name || 'entrada').toLowerCase();
  const toName = (getDestinationSectorName(move) || '').toLowerCase();
  const obs = (move.observation || move.material?.request?.rejection_reason || '').toLowerCase();
  const dateFormatted = new Date(move.moved_at).toLocaleDateString('pt-BR');

  return matName.includes(q) || matSerial.includes(q) || compName.includes(q) ||
         actorName.includes(q) || actorReg.includes(q) || fromName.includes(q) ||
         toName.includes(q) || obs.includes(q) || dateFormatted.includes(q);
};
