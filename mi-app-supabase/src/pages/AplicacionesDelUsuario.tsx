import React, { useState } from 'react';
import TimeDifferenceCalculator from '../components/TimeDifferenceCalculator';
import ListaDeTareas from '../components/ListaDeTareas';
import { BotonDesplegable, ContenedorTareas, ContenedorLista } from '../Styles/EstilosAplicaciones';


const AplicacionesDelUsuarioPage: React.FC = () => { 
  const [mostrarTareas, setMostrarTareas] = useState(false);

  return (
    
    <div className="p-4">
      <ContenedorTareas>
        <BotonDesplegable onClick={() => setMostrarTareas(!mostrarTareas)}>
          <span>📋 Lista de Tareas</span>
          <span>{mostrarTareas ? '▲' : '▼'}</span>
        </BotonDesplegable>

        {mostrarTareas && (
          <ContenedorLista>
            <ListaDeTareas />
          </ContenedorLista>
        )}
      </ContenedorTareas>

      <TimeDifferenceCalculator />
    </div> 
); 

}; 
      
      
export default AplicacionesDelUsuarioPage;
