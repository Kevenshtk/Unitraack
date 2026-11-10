import { api } from '../../../lib/axios';

export const dashboardService = {
  async getMonitoring() {
    const response = await api.get('/gestor/monitoring');
    return response.data;
  },

  async getDashboard() {
    const response = await api.get('/gestor/dashboard');
    return response.data;
  },

  async updateMaterialPosition(materialId: string, x: number, y: number) {
    const response = await api.post('/gestor/material-position', {
      material_id: materialId,
      x,
      y
    });
    return response.data;
  },

  async updateMapLayout(layouts: any[]) {
    const response = await api.post('/gestor/map-layout', { layouts });
    return response.data;
  },

  async getThirdPartyStats() {
    const response = await api.get('/gestor/third-parties');
    return response.data;
  },

  async getAuditReport(profileId: string) {
    const response = await api.get(`/gestor/audit-report?profileId=${profileId}`);
    return response.data;
  }
};

