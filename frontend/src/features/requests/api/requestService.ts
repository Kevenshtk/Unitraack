import { api } from '../../../lib/axios';

export const requestService = {
  async getSectors() {
    const response = await api.get('/sectors');
    return response.data?.data ?? response.data ?? [];
  },

  async createRequest(payload: Record<string, any>) {
    const response = await api.post('/terceirizada/requisicao', payload);
    return response;
  },

  async updateRequest(id: string, payload: Record<string, any>) {
    const response = await api.put(`/terceirizada/requisicao/${id}`, payload);
    return response;
  },

  async getPartnerProfile() {
    const response = await api.get('/terceirizada/profile');
    return response.data?.data ?? response.data;
  },

  async getPartnerRequests() {
    const response = await api.get('/terceirizada/requisicoes');
    return response.data?.data ?? response.data ?? [];
  },

  async cancelPartnerRequest(id: string) {
    const response = await api.post(`/terceirizada/requisicoes/${id}/cancel`, {});
    return response.data;
  },

  async deletePartnerRequest(id: string) {
    const response = await api.delete(`/terceirizada/requisicoes/${id}`);
    return response.data;
  },
};

