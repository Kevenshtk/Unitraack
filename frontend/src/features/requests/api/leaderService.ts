import { api } from '../../../lib/axios';
import type {
  Requisicao,
  Material,
  MovementRecord,
  LiderInfo,
  LeaderTransferPayload,
  LeaderExitPayload,
  LeaderAcceptPayload,
  LeaderRejectTransferPayload,
  LeaderReviewPayload
} from '../components/lider/types';

export interface LeaderPendenciasResponse {
  requests: Requisicao[];
  lider?: LiderInfo;
}

export const leaderService = {
  /**
   * Busca as pendências de aprovação do setor do líder
   */
  async getPendencias(): Promise<LeaderPendenciasResponse> {
    const response = await api.get('/lider/pendencias');
    const responseData = response.data?.data ?? response.data;
    return {
      requests: responseData?.requests ?? [],
      lider: responseData?.lider
    };
  },

  /**
   * Aprova ou recusa uma requisição de entrada
   */
  async reviewRequest(requestId: string, payload: LeaderReviewPayload) {
    const response = await api.post(`/lider/revisar/${requestId}`, payload);
    return response.data;
  },

  /**
   * Busca os equipamentos/materiais sob responsabilidade do setor do líder
   */
  async getSectorMaterials(): Promise<Material[]> {
    const response = await api.get('/lider/meu-setor');
    return response.data?.data ?? response.data ?? [];
  },

  /**
   * Transfere um ou mais materiais para outro setor interno
   */
  async transferMaterial(payload: LeaderTransferPayload) {
    const response = await api.post('/lider/transferir', payload);
    return response.data;
  },

  /**
   * Aceita a transferência de materiais recebidos
   */
  async acceptTransfer(payload: LeaderAcceptPayload) {
    const response = await api.post('/lider/aceitar-transferencia', payload);
    return response.data;
  },

  /**
   * Recusa a transferência de materiais com justificativa obrigatória
   */
  async rejectTransfer(payload: LeaderRejectTransferPayload) {
    const response = await api.post('/lider/recusar-transferencia', payload);
    return response.data;
  },

  /**
   * Cancela o envio em trânsito de uma transferência
   */
  async cancelTransfer(payload: { materialIds: string[] }) {
    const response = await api.post('/lider/cancelar-transferencia', payload);
    return response.data;
  },

  /**
   * Solicita saída / baixa dos equipamentos selecionados
   */
  async markMaterialForExit(payload: LeaderExitPayload) {
    const response = await api.post('/lider/marcar-saida', payload);
    return response.data;
  },

  /**
   * Busca o histórico de movimentações vinculadas ao setor
   */
  async getSectorMovements(sectorId?: string): Promise<MovementRecord[]> {
    const url = sectorId ? `/lider/movimentacoes?sectorId=${sectorId}` : '/lider/movimentacoes';
    const response = await api.get(url);
    return response.data?.data ?? response.data ?? [];
  }
};

