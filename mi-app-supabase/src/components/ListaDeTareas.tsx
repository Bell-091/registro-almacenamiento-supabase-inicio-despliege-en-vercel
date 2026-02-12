import React, { useState, useEffect } from 'react';
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
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState<string>('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [textoEditado, setTextoEditado] = useState<string>('');

  // Cargar desde localStorage
  useEffect(() => {
    try {
      const tareasGuardadas = localStorage.getItem('tareas');
      if (tareasGuardadas) {
        const tareasParseadas: Tarea[] = JSON.parse(tareasGuardadas);
        console.log('📥 Cargando tareas desde localStorage:', tareasParseadas);
        setTareas(tareasParseadas);
        console.log('✅ Tareas cargadas correctamente', tareasParseadas);
      } else {
        console.log('📂 No se encontraron tareas guardadas en localStorage');
      }
    } catch (error) {
      console.error("❌ Error cargando tareas:", error);
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    try {
      console.log("🔄 Guardando tareas en localStorage:", tareas);
      localStorage.setItem('tareas', JSON.stringify(tareas));
      console.log("✅ Tareas guardadas en localStorage", tareas);
    } catch (error) {
      console.error("❌ Error guardando tareas:", error);
    }
  }, [tareas]);

  const agregarTarea = (e: React.FormEvent) => {
    e.preventDefault();
    const texto = nuevaTarea.trim();
    if (texto === '') return;

    const nueva: Tarea = { id: Date.now(), texto, completada: false };
    console.log("✅ Nueva tarea creada:", nueva);
    setTareas((tareasPrevias) => {
      const nuevasTareas = [...tareasPrevias, nueva];
      console.log('✅ Nuevas tareas actualizadas:', nuevasTareas);
      return nuevasTareas;
    });

    setNuevaTarea('');
  };

  const eliminarTarea = (id: number) => {
    if (window.confirm('¿Estás seguro que deseas eliminar esta tarea?')) {
      setTareas(tareas.filter(t => t.id !== id));
      console.log("Tarea eliminada correctamente su id es >: ", id)
    }
  };

  const toggleCompletada = (id: number) => {
    setTareas(tareas.map(t =>
      t.id === id ? { ...t, completada: !t.completada } : t
    ));
  };

  const iniciarEdicion = (id: number, texto: string) => {
    setEditandoId(id);
    setTextoEditado(texto);
  };

  const guardarEdicion = (id: number) => {
    const texto = textoEditado.trim();
    if (texto === '') return;

    setTareas(tareas.map(t =>
      t.id === id ? { ...t, texto } : t
    ));
    cancelarEdicion();
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
