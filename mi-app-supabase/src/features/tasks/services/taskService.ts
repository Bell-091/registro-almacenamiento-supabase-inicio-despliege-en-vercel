import { supabase } from '../../../lib/supabaseClient';
import type { Tarea } from '../types';

export const getTareas = async (userId: string): Promise<Tarea[]> => {
  const { data, error } = await supabase
    .from('tareas')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data as Tarea[];
};

export const createTarea = async (
  texto: string,
  userId: string
): Promise<Tarea> => {
  const { data, error } = await supabase
    .from('tareas')
    .insert([{ texto, user_id: userId }])
    .select()
    .single();

  if (error) throw error;

  return data as Tarea;
};

export const deleteTarea = async (
  id: number,
  userId: string
): Promise<void> => {
  const { error } = await supabase
    .from('tareas')
    .delete()
    .eq('user_id', userId)
    .eq('id', id);

  if (error) throw error;
};


export const updateCompletada = async (
  id: number,
  completada: boolean,
  userId: string
): Promise<void> => {
  const { error } = await supabase
    .from('tareas')
    .update({ completada })
    .eq('user_id', userId)
    .eq('id', id);

  if (error) throw error;
};

export const updateTexto = async (
  id: number,
  texto: string,
  userId: string
): Promise<void> => {
  const { error } = await supabase
    .from('tareas')
    .update({ texto })
    .eq('user_id', userId)
    .eq('id', id);

  if (error) throw error;
};
