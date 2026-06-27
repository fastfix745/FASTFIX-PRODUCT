import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase/client';

export interface Demand {
  id: string;
  protocol: string;
  title: string;
  description?: string;
  category: string;
  neighborhood?: string;
  status: 'pending' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  secretaria?: string;
  city?: string;
  user_id?: string;
  is_public: boolean;
  resolved_at?: string;
  created_at: string;
}

// Buscar demandas públicas (resolvidas) para o painel público
export function usePublicDemands() {
  return useQuery({
    queryKey: ['demands', 'public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('demands')
        .select('*')
        .eq('is_public', true)
        .order('resolved_at', { ascending: false });
      if (error) throw error;
      return data as Demand[];
    }
  });
}

// Buscar demandas do cidadão logado
export function useMyDemands() {
  return useQuery({
    queryKey: ['demands', 'mine'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('demands')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Demand[];
    }
  });
}

// Buscar todas as demandas (gestor)
export function useAllDemands() {
  return useQuery({
    queryKey: ['demands', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('demands')
        .select('*, profiles(name, email)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Demand[];
    }
  });
}

// Criar demanda
export function useCreateDemand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (demand: {
      title: string;
      description: string;
      category: string;
      neighborhood: string;
      city: string;
      user_id: string;
    }) => {
      const protocol = `PFX-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
      const { data, error } = await supabase
        .from('demands')
        .insert({ ...demand, protocol, status: 'pending', priority: 'medium' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] });
    }
  });
}

// Atualizar status da demanda (gestor)
export function useUpdateDemandStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, secretaria, priority }: {
      id: string;
      status: 'pending' | 'in_progress' | 'resolved';
      secretaria?: string;
      priority?: 'low' | 'medium' | 'high';
    }) => {
      const { data, error } = await supabase
        .from('demands')
        .update({ status, secretaria, priority, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] });
    }
  });
}