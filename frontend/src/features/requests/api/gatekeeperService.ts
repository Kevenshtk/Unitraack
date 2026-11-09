import { api } from '../../../lib/axios';

export type GateStatus =
  | 'WAITING_ARRIVAL'
  | 'ARRIVED'
  | 'IN_ANALYSIS'
  | 'WAITING_EXIT'
  | 'EXIT_CONFERENCE';

export interface GateMovementPayload {
  materialIds: string[];
  type: 'ENTRY' | 'EXIT' | 'IN_PLANTA';
  signature: string;
  photos?: string[];
  observation?: string;
}

export const gatekeeperService = {
  async getApprovedRequests(statuses: string[]) {
    const query = new URLSearchParams();
    statuses.forEach((s) => query.append('status', s));
    const response = await api.get(`/portaria/approved?${query.toString()}`);
    return response.data?.data ?? response.data ?? [];
  },

  async getAuditHistory(tenantId: string, onlyPortaria = true) {
    const response = await api.get(`/portaria/audit/${tenantId}?onlyPortaria=${onlyPortaria}`);
    return response.data?.data ?? response.data ?? [];
  },

  async updateGateStatus(requestId: string, status: GateStatus) {
    const response = await api.post(`/portaria/status/${requestId}`, { status });
    return response.data;
  },

  async confirmMovement(requestId: string, payload: GateMovementPayload) {
    const response = await api.post(`/portaria/movimentacao/${requestId}`, payload);
    return response.data;
  },

  async cancelEntry(requestId: string, reason: string) {
    const response = await api.post(`/portaria/cancelar/${requestId}`, { reason });
    return response.data;
  },

  async notifyDiscrepancy(requestId: string, reason: string) {
    const response = await api.post(`/portaria/divergencia/${requestId}`, { reason });
    return response.data;
  },
};

