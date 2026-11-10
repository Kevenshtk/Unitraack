import { api } from '../../../lib/axios';

export const teamService = {
  async getTeamMembers() {
    const response = await api.get('/gestor/team');
    return response.data?.data ?? response.data ?? [];
  },

  async updateTeamMember(id: string, data: Record<string, any>) {
    const response = await api.put(`/gestor/team/${id}`, data);
    return response.data;
  },

  async deleteTeamMember(id: string) {
    const response = await api.delete(`/gestor/team/${id}`);
    return response.data;
  },

  async resetMemberPassword(id: string, newPassword: string) {
    const response = await api.post(`/gestor/team/${id}/reset-password`, { newPassword });
    return response.data;
  },

  async registerInternalMember(payload: Record<string, any>) {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },
};

