import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {Container, Title, Form, Input, Button, TaskList, TaskItem, DeleteButton, EditButton, SaveButton, CancelButton} from '../Styles/EstilosAplicaciones';
import type { Tarea } from '../features/tasks/types';
import { getTareas } from '../features/tasks/services/taskService';
import { createTarea } from '../features/tasks/services/taskService';
import { deleteTarea } from '../features/tasks/services/taskService';
import { updateCompletada } from '../features/tasks/services/taskService';
import { updateTexto } from '../features/tasks/services/taskService';

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
    const data = await getTareas(user.id);
    setTareas(data);
  } catch (error) {
    console.error("Error cargando tareas:", error);
  }
};


 const agregarTarea = async (e: React.FormEvent) => {
  e.preventDefault();

  const texto = nuevaTarea.trim();
  if (texto === '' || !user) return;

  try {
    const nueva = await createTarea(texto, user.id);
    setTareas([...tareas, nueva]);
    setNuevaTarea('');
  } catch (error) {
    console.error("Error agregando tarea:", error);
  }
};


 const eliminarTarea = async (id: number) => {
  if (!user) return;

  if (window.confirm('¿Estás seguro que deseas eliminar esta tarea?')) {
    try {
      await deleteTarea(id, user.id);
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
    await updateCompletada(id, !tarea.completada, user.id);

    setTareas(
      tareas.map(t =>
        t.id === id ? { ...t, completada: !t.completada } : t
      )
    );
  } catch (error) {
    console.error("Error actualizando tarea:", error);
  }
};

const guardarEdicion = async (id: number) => {
  if (!textoEditado.trim() || !user) return;

  try {
    await updateTexto(id, textoEditado, user.id);

    setTareas(
      tareas.map(t =>
        t.id === id ? { ...t, texto: textoEditado } : t
      )
    );

    setEditandoId(null);
    setTextoEditado('');
  } catch (error) {
    console.error("Error actualizando tarea:", error);
  }
};


  const cancelarEdicion = () => {
    setEditandoId(null);
    setTextoEditado('');
  };

  const iniciarEdicion = (tarea: Tarea) => {
  setEditandoId(tarea.id);
  setTextoEditado(tarea.texto);
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

              {tareas.map((tarea) => (
        <TaskItem key={tarea.id} $completada={tarea.completada}>
          {editandoId === tarea.id ? (
            <>
              <Input
                type="text"
                value={textoEditado}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTextoEditado(e.target.value)
                }
                autoFocus
              />
              <SaveButton onClick={() => guardarEdicion(tarea.id)}>
                Guardar
              </SaveButton>
              <CancelButton onClick={cancelarEdicion}>
                Cancelar
              </CancelButton>
            </>
          ) : (
            <>
              <span
                onClick={() => toggleCompletada(tarea.id)}
                style={{
                  cursor: 'pointer',
                  flexGrow: 1,
                  textDecoration: tarea.completada ? 'line-through' : 'none',
                }}
              >
                {tarea.texto}
              </span>

              <EditButton onClick={() => iniciarEdicion(tarea)}>
                Editar
              </EditButton>

              <DeleteButton onClick={() => eliminarTarea(tarea.id)}>
                Eliminar
              </DeleteButton>
            </>
          )}
        </TaskItem>
      ))}

      </TaskList>
    </Container>
  );
}

export default ListaDeTareas;
