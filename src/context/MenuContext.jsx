import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import catalogFallback from '../languages/spanish.json'; // Respaldo inicial mientras carga Firestore
//import { useMenu } from './MenuContext';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuData, setMenuData] = useState(catalogFallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escucha en tiempo real el documento "spanish" en la colección "menu"
    const unsubscribe = onSnapshot(
      doc(db, "menu", "spanish"),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setMenuData(docSnapshot.data());
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error al obtener el menú de Firestore:", error);
        setLoading(false);
      }
    );

    // Cancela la suscripción al desmontar el componente para evitar consumo innecesario
    return () => unsubscribe();
  }, []);

  return (
    <MenuContext.Provider value={{ menuData, loading }}>
      {children}
    </MenuContext.Provider>
  );
};

// Hook personalizado para acceder al menú en vivo desde cualquier componente
export const useMenu = () => useContext(MenuContext);