import { useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { ActiveTab } from '../components/portaria/types';

export function useGatekeeperRealtime(
  activeTab: ActiveTab,
  onRefresh: () => Promise<void> | void
): void {
  // Polling a cada 30s para atualizar automaticamente chegadas agendadas e sincronizar fila
  useEffect(() => {
    const interval = setInterval(() => {
      onRefresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [activeTab, onRefresh]);

  // Subscrição Realtime nas tabelas entry_requests e material_movements
  useEffect(() => {
    const channel = supabase
      .channel('portaria_dashboard_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'entry_requests' }, () => {
        console.log('[Realtime] entry_requests changed, refreshing portaria...');
        onRefresh();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'material_movements' }, () => {
        console.log('[Realtime] material_movements changed, refreshing portaria...');
        onRefresh();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab, onRefresh]);
}

