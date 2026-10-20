import React, { useState, useEffect } from 'react';
import "./kart2-styles.css";
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';

export const Kart2 = () => {  
  const carritoImage = './images/carrito-compras.webp';  
  const { carrito, totalPagar } = useCart();
  
  // Calculamos el total de ítems acumulados en el carrito
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

  // Estado para controlar la activación de la animación visual
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    // Si no hay ítems, no disparamos animación
    if (totalItems === 0) return;

    // Activamos la animación
    setIsBouncing(true);

    // Apagamos la clase de animación tras 400ms para permitir que vuelva a ejecutarse al agregar otro producto
    const timer = setTimeout(() => {
      setIsBouncing(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [totalItems]);

  return (
    <Link to="/Carrito">   
        {totalItems > 0 && (
            <div className={`kart-container ${isBouncing ? 'kart-bounce-active' : ''}`}>
              {/*<div className={`kartCounter ${isBouncing ? 'counter-pop' : ''}`}>
                <p>{totalItems}</p>
              </div>*/}
                      
              <img 
                src={carritoImage} 
                alt='imagen-carrito'                    
              />
              <p className='totalPagar'>
                <strong>
                  {totalItems} {totalItems === 1 ? 'Producto' : 'Productos'} ${totalPagar.toLocaleString('es-CO')}
                </strong>
              </p>
            </div>
          )}
     </Link>
  );
};