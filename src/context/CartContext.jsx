import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useMenu } from '../context/MenuContext';

const CartContext = createContext();

// Helper 1: Busca un producto por su 'id' en el catálogo de Firestore
const findProductInCatalog = (id, catalog) => {
  if (!id || !catalog?.cards) return null;

  for (const key in catalog.cards) {
    if (Array.isArray(catalog.cards[key])) {
      const found = catalog.cards[key].find((item) => item.id === id);
      if (found) return found;
    }
  }

  return null;
};

// Helper 2: Verifica si la oferta está activa según offerPrice, días y horas
const checkIsPromoActive = (product) => {
  if (!product?.offerPrice || product.offerPrice.trim() === '' || !Array.isArray(product?.days) || product.days.length === 0) {
    return false;
  }

  const now = new Date();
  const currentDay = now.getDay(); // 0 (Domingo) a 6 (Sábado)

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;

  const validDays = product.days.map((d) => Number(d));
  const isDayValid = validDays.includes(currentDay);
  const isTimeValid =
    (!product.startHour || currentTime >= product.startHour) &&
    (!product.endHour || currentTime <= product.endHour);

  return isDayValid && isTimeValid;
};

export const CartProvider = ({ children }) => {
  const { menuData } = useMenu();

  const [rawCart, setRawCart] = useState(() => {
    try {
      const carritoGuardado = localStorage.getItem('carritoLili');
      return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch (error) {
      console.error('Error al leer localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('carritoLili', JSON.stringify(rawCart));
  }, [rawCart]);

  // Hidratación y re-validación de precios en tiempo real
  const carrito = useMemo(() => {
    return rawCart
      .map((rawItem) => {
        const catalogItem = findProductInCatalog(rawItem.id, menuData);

        if (!catalogItem || catalogItem.available === false) {
          return null;
        }

        const isStock = catalogItem.stock !== false;
        const isPromo = isStock && checkIsPromoActive(catalogItem);

        // Lógica de Precios: Si hay oferta activa toma offerPrice, sino regularPrice
        const priceString = isPromo && catalogItem.offerPrice && catalogItem.offerPrice.trim() !== ''
          ? catalogItem.offerPrice
          : (catalogItem.regularPrice || catalogItem.price || '0');

        const precioNumerico = parseInt(priceString.replace(/[^0-9]/g, '') || '0', 10);

        return {
          ...catalogItem,
          cantidad: rawItem.cantidad,
          observacion: rawItem.observacion || '',
          isPromo,
          price: priceString, // Asigna el precio vigente
          precioNumerico,
          isStock,
          subtotal: isStock ? precioNumerico * rawItem.cantidad : 0,
        };
      })
      .filter(Boolean);
  }, [rawCart, menuData]);

  const totalItems = useMemo(() => {
    return carrito.reduce((total, item) => total + (item.isStock ? item.cantidad : 0), 0);
  }, [carrito]);

  const totalPagar = useMemo(() => {
    return carrito.reduce((total, item) => total + item.subtotal, 0);
  }, [carrito]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    if (cantidad <= 0 || !producto?.id) return;

    setRawCart((prevCart) => {
      const existeIndex = prevCart.findIndex((item) => item.id === producto.id);

      if (existeIndex >= 0) {
        const updated = [...prevCart];
        updated[existeIndex] = {
          ...updated[existeIndex],
          cantidad: updated[existeIndex].cantidad + cantidad,
        };
        return updated;
      } else {
        return [...prevCart, { id: producto.id, cantidad, observacion: '' }];
      }
    });
  };

  const incrementar = (id) => {
    setRawCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  const decrementar = (id) => {
    setRawCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const eliminar = (id) => {
    setRawCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const actualizarObservacion = (id, texto) => {
    setRawCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, observacion: texto } : item
      )
    );
  };

  const vaciarCarrito = () => setRawCart([]);

  return (
    <CartContext.Provider
      value={{
        carrito,
        totalItems,
        totalPagar,
        agregarAlCarrito,
        incrementar,
        decrementar,
        eliminar,
        actualizarObservacion,
        vaciarCarrito,
        setCarrito: setRawCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};