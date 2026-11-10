import { useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';

export interface UseLeaderRealtimeParams {
  onMaterialsChange: () => void | Promise<void>;
  onMovementsChange: () => void | Promise<void>;
  onRequestsChange: () => void | Promise<void>;
}

export function useLeaderRealtime({
  onMaterialsChange,
  onMovementsChange,
  onRequestsChange
}: UseLeaderRealtimeParams): void {
  const callbacksRef = useRef({
    onMaterialsChange,
    onMovementsChange,
    onRequestsChange
  });

  useEffect(() => {
    callbacksRef.current = {
      onMaterialsChange,
      onMovementsChange,
      onRequestsChange
    };
  }, [onMaterialsChange, onMovementsChange, onRequestsChange]);

  useEffect(() => {
    const channel = supabase
      .channel('lider_dashboard_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'materials' },
        () => {
          callbacksRef.current.onMaterialsChange();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'material_movements' },
        () => {
          callbacksRef.current.onMaterialsChange();
          callbacksRef.current.onMovementsChange();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'entry_requests' },
        () => {
          callbacksRef.current.onRequestsChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}

