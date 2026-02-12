import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import {
  Container, Title, Form, Input, Button,
  TaskList, TaskItem, DeleteButton, EditButton, SaveButton, CancelButton
} from '../Styles/EstilosAplicaciones';

// Definimos la interfaz para el objeto Tarea
interface Tarea {
  id: number;
  texto: string;
  completada: boolean;
}

function ListaDeTareas() {
  // Tipamos el estado como un array de Tarea
  const { user } = useAuth();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState<string>('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [textoEditado, setTextoEditado] = useState<string>('');

  // Cargar tareas desde Supabase al iniciar o cambiar de usuario
  useEffect(() => {
    if (user) {
      fetchTareas();
    } else {
      setTareas([]); // Limpiar tareas si no hay usuario
    }
  }, [user]);

  const fetchTareas = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('tareas')
        .select('*')
        .eq('user_id', user.id) // <-- AÑADIDO: Filtrar tareas por usuario
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) setTareas(data);
    } catch (error) {
      console.error("Error cargando tareas:", error);
    }
  };

  const agregarTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    const texto = nuevaTarea.trim();
    if (texto === '' || !user) return;

    try {
      const { data, error } = await supabase
        .from('tareas')
        .insert([{ texto, user_id: user.id }])
        .select();

      if (error) throw error;

      if (data) {
        setTareas([...tareas, ...data]);
        setNuevaTarea('');
      }
    } catch (error) {
      console.error("Error agregando tarea:", error);
    }
  };

  const eliminarTarea = async (id: number) => {
    if (!user) return;
    if (window.confirm('¿Estás seguro que deseas eliminar esta tarea?')) {
      try {
        const { error } = await supabase
          .from('tareas')
          .delete()
          .eq('user_id', user.id) // <-- AÑADIDO: Asegurar que el usuario es el dueño
          .eq('id', id);

        if (error) throw error;
        setTareas(tareas.filter(t => t.id !== id));
      } catch (error) {
        console.error("Error eliminando tarea:", error);
      }
    }
  };

  const toggleCompletada = async (id: number) => {
    const tarea = tareas.find(t => t.id === id);
    if (!tarea || !user) return;
    
    try {
      const { error } = await supabase
        .from('tareas')
        .update({ completada: !tarea.completada })
        .eq('user_id', user.id) // <-- AÑADIDO: Asegurar que el usuario es el dueño
        .eq('id', id);

      if (error) throw error;

      setTareas(tareas.map(t =>
        t.id === id ? { ...t, completada: !t.completada } : t
      ));
    } catch (error) {
      console.error("Error actualizando tarea:", error);
    }
  };

  const iniciarEdicion = (id: number, texto: string) => {
    setEditandoId(id);
    setTextoEditado(texto);
  };

  const guardarEdicion = async (id: number) => {
    const texto = textoEditado.trim();
    if (texto === '' || !user) return;
    
    try {
      const { error } = await supabase
        .from('tareas')
        .update({ texto })
        .eq('user_id', user.id) // <-- AÑADIDO: Asegurar que el usuario es el dueño
        .eq('id', id);

      if (error) throw error;

      setTareas(tareas.map(t =>
        t.id === id ? { ...t, texto } : t
      ));
      cancelarEdicion();
    } catch (error) {
      console.error("Error editando tarea:", error);
    }
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setTextoEditado('');
  };

  return (
    <Container>
      <Title>📝 Lista de Tareas</Title>
      <Form onSubmit={agregarTarea}>
        <Input
          type="text"
          value={nuevaTarea}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNuevaTarea(e.target.value)}
          placeholder="Agrega tu tarea aqui"
          aria-label="Nueva tarea"
        />
        <Button type="submit">Añadir</Button>
      </Form>

      <TaskList>
        {tareas.length === 0 && <p>No hay tareas aún.</p>}

        {tareas.map(({ id, texto, completada }) => (
          <TaskItem key={id} $completada={completada}>
            {editandoId === id ? (
              <>
                <Input
                  type="text"
                  value={textoEditado}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTextoEditado(e.target.value)}
                  autoFocus
                />
                <SaveButton onClick={() => guardarEdicion(id)}>Guardar</SaveButton>
                <CancelButton onClick={cancelarEdicion}>Cancelar</CancelButton>
              </>
            ) : (
              <>
                <span
                  onClick={() => toggleCompletada(id)}
                  style={{
                    cursor: 'pointer',
                    flexGrow: 1,
                    textDecoration: completada ? 'line-through' : 'none',
                  }}
                >
                  {texto}
                </span>
                <EditButton onClick={() => iniciarEdicion(id, texto)}>Editar</EditButton>
                <DeleteButton onClick={() => eliminarTarea(id)}>Eliminar</DeleteButton>
              </>
            )}
          </TaskItem>
        ))}
      </TaskList>
    </Container>
  );
}

export default ListaDeTareas;
