import styled from 'styled-components';

export const ContenedorTareas = styled.div`
  max-width: 42rem; /* Equivalente a max-w-2xl */
  margin: 0 auto 2rem auto; /* Centrado y con margen inferior para separar de la calculadora */
  padding: 0 1rem; /* Espacio lateral para que no pegue con los bordes en móvil */

  &:first-child {
    margin-top: 90px; /* Baja el primer contenedor para que no lo tape el navbar */

    @media (max-width: 768px) {
      margin-top: 1rem; /* En móvil el navbar es relativo, solo necesitamos un pequeño espacio */
    }
  }
`;

export const BotonDesplegable = styled.button`
  width: 100%;
  background-color: #1f2937; /* bg-gray-800 */
  color: white;
  font-weight: bold;
  padding: 0.75rem 1rem; /* py-3 px-4 */
  border-radius: 0.25rem; /* rounded */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); /* shadow */
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #374151; /* hover:bg-gray-700 */
  }
`;

export const ContenedorLista = styled.div`
  margin-top: 1rem; /* mt-4 */
`;

// --- Estilos de la Lista de Tareas ---

export const Container = styled.div`
  background-color: #2f2f2f;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  /* max-width: 600px;  (Opcional: dejar que el contenedor padre controle el ancho) */
  color: #f0f0f0;
`;

export const Title = styled.h2`
  color: #ffffff;
  text-align: center;
  margin-bottom: 25px;
  font-weight: 600;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Input = styled.input`
  padding: 12px;
  border: 1px solid #555;
  background-color: #3d3d3d;
  color: #fff;
  border-radius: 6px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #888;
  }
`;

export const Button = styled.button`
  padding: 12px;
  background-color: #555;
  color: #f0f0f0;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #666;
  }
`;

export const TaskList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
  background-color: #3a3a3a;
  border-radius: 6px;
  overflow-y: auto;
  max-height: 300px;
  border: 1px solid #444;
`;

interface TaskItemProps {
  $completada: boolean;
}

export const TaskItem = styled.li<TaskItemProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #555;
  text-decoration: ${(props) => (props.$completada ? 'line-through' : 'none')};
  color: ${(props) => (props.$completada ? '#888' : '#fff')};

  &:hover {
    background-color: #4a4a4a;
  }
`;

export const DeleteButton = styled(Button)`
  background-color: #8b0000;

  &:hover {
    background-color: #a30000;
  }
`;

export const EditButton = styled(Button)`
  background-color: #cccc00;
  color: #222;

  &:hover {
    background-color: #e6e600;
  }
`;

export const SaveButton = styled(Button)`
  background-color: #28a745;

  &:hover {
    background-color: #218838;
  }
`;

export const CancelButton = styled(Button)`
  background-color: #d9534f;

  &:hover {
    background-color: #c9302c;
  }
`;