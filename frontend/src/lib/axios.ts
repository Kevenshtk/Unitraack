import axios from 'axios';
import { supabase } from './supabase';
import { getAuthToken, getSubdomain, getTokenKey } from '../utils/subdomain';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
});

// Interceptor para adicionar o token de autorização e o X-Tenant-Slug em todas as requisições
api.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      let activeSession = session;

      if (activeSession) {
        // Se o token estiver expirado ou prestes a expirar nos próximos 10 segundos
        const isExpired = activeSession.expires_at 
          ? (activeSession.expires_at * 1000) < Date.now() + 10000 
          : false;

        if (isExpired) {
          console.log('[Axios Interceptor] Token expirado detectado. Renovando sessão antes do envio da requisição...');
          const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
          if (!refreshError && refreshedSession) {
            activeSession = refreshedSession;
          }
        }
      }

      const token = activeSession?.access_token || getAuthToken();
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (activeSession?.access_token) {
        sessionStorage.setItem(getTokenKey(), activeSession.access_token);
      }

      const slug = getSubdomain();
      if (slug && !config.headers['X-Tenant-Slug']) {
        config.headers['X-Tenant-Slug'] = slug;
      }
    } catch (error) {
      console.error('[Axios Interceptor] Erro ao obter sessão do Supabase:', error);
      const fallbackToken = getAuthToken();
      if (fallbackToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${fallbackToken}`;
      }
      const slug = getSubdomain();
      if (slug && !config.headers['X-Tenant-Slug']) {
        config.headers['X-Tenant-Slug'] = slug;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para renovar automaticamente caso receba 401 (Token expirado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        console.warn('[Axios Interceptor] 401 recebido (Token inválido/expirado). Renovando sessão...');
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
        if (!refreshError && session?.access_token) {
          sessionStorage.setItem('usinalins-auth-token-v1', session.access_token);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
          return api(originalRequest);
        }
      } catch (err) {
        console.error('[Axios Interceptor] Falha ao renovar sessão após 401:', err);
      }
    }
    return Promise.reject(error);
  }
);


