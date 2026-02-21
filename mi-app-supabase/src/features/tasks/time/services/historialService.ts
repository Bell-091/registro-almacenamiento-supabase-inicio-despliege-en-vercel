import { supabase } from '../../../../lib/supabaseClient'
import type { HistorialItem } from '../types'

export const getHistorial = async (userId: string): Promise<HistorialItem[]> => {
  const { data, error } = await supabase
    .from('historial_calculos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as HistorialItem[]
}

export const createHistorial = async (
  userId: string,
  nombre: string,
  resultado: string,
  prioridad: string
): Promise<HistorialItem> => {

  const { data, error } = await supabase
    .from('historial_calculos')
    .insert([{ user_id: userId, nombre, resultado, prioridad }])
    .select()
    .single()

  if (error) throw error
  return data as HistorialItem
}

export const deleteHistorial = async (id: number, userId: string) => {
  const { error } = await supabase
    .from('historial_calculos')
    .delete()
    .eq('user_id', userId)
    .eq('id', id)

  if (error) throw error
}

export const updateHistorial = async (
  id: number,
  userId: string,
  nombre: string,
  prioridad: string
) => {
  const { error } = await supabase
    .from('historial_calculos')
    .update({ nombre, prioridad })
    .eq('user_id', userId)
    .eq('id', id)

  if (error) throw error
}
