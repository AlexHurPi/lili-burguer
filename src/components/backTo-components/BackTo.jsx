/*
* Componente BackTo
* ----------------
* Crea un botón de enlace pensado para regresar a la pantalla de Inicio desde vistas secundarias (como ProductDetails).
* 
* Funcionamiento:
* Al hacer clic, intercepta la navegación predeterminada mediante e.preventDefault() y ejecuta el hook 
* useNavigate() con el parámetro (-1). Esto obliga al navegador a retroceder en su historial, conservando 
* la posición exacta de desplazamiento (scroll) en la que el usuario se encontraba previamente en Inicio.
* 
* Uso e Importación:
* Se importa e incluye directamente dentro de las páginas/componentes secundarios donde se requiera
* el botón de regreso.
*/

import React from 'react';
import './backTo-styles.css';
import { Link, useNavigate } from 'react-router-dom'; 

export const BackTo = () => {
  const volver = './images/Icono-volver6.webp'; // Ruta de la imagen
  const navigate = useNavigate(); // Inicializamos el hook navigate

  // Función simplificada: siempre ejecuta el retroceso en el historial
  const handleBackClick = (e) => {
    e.preventDefault(); 
    navigate(-1);       
  };   

  return (
    <div className="backTo-container">         
      <Link to={'/'} onClick={handleBackClick}>                 
        <img 
          src={volver} 
          alt='home-image'
          style={{ height: '40px' }} 
        />
      </Link>
    </div>
  );
};