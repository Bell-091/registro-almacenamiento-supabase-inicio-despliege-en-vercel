import styled from 'styled-components';

// Contenedor principal
export const Container = styled.div`
  /*Bajar el contenedor de la lista de tareas bajo la barra de navegación*/

  background-color: #2f2f2f; /* Gris oscuro elegante */
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  margin: 100px auto;
  color: #f0f0f0;
`;

// Título
export const Title = styled.h2`
  color: #ffffff;
  text-align: center;
  margin-bottom: 25px;
  font-weight: 600;
`;

// Formulario
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// Input de texto
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

// Botón principal
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

// Lista de tareas
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

// Item individual
export const TaskItem = styled.li`
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

// Botón eliminar
export const DeleteButton = styled(Button)`
  background-color: #8b0000;

  &:hover {
    background-color: #a30000;
  }
`;

// Botón editar
export const EditButton = styled(Button)`
  background-color: #cccc00;
  color: #222;

  &:hover {
    background-color: #e6e600;
  }
`;

// Botón guardar
export const SaveButton = styled(Button)`
  background-color: #28a745;

  &:hover {
    background-color: #218838;
  }
`;

// Botón cancelar
export const CancelButton = styled(Button)`
  background-color: #d9534f;

  &:hover {
    background-color: #c9302c;
  }
`;
