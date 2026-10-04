import React, { useState, useEffect } from 'react';
import "./kart-styles.css";
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';

export const Kart = () => {  
  const carritoImage = './images/carrito-compras.webp';  
  const { carrito } = useCart();
  
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
    <div className={`kart-container ${isBouncing ? 'kart-bounce-active' : ''}`}>
      <div className={`kartCounter ${isBouncing ? 'counter-pop' : ''}`}>
        <p>{totalItems}</p>
      </div>

      <Link to="/Carrito">         
        <img 
          src={carritoImage} 
          alt='imagen-carrito'                    
        />
      </Link>
    </div>
  );
};