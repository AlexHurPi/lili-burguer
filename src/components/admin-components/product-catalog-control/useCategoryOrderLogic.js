import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useMenu } from '../../../context/MenuContext';

export const useCategoryOrderLogic = () => {
  const { menuData } = useMenu();
  const [orderedKeys, setOrderedKeys] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  // Sincroniza la lista de categorías al cargar de Firestore
  useEffect(() => {
    if (menuData?.cards) {
      const allKeys = Object.keys(menuData.cards);
      const savedOrder = menuData?.categoryOrder || [];

      // Fusiona el orden guardado con claves nuevas que no estén registradas aún
      const combinedOrder = [
        ...savedOrder.filter((key) => allKeys.includes(key)),
        ...allKeys.filter((key) => !savedOrder.includes(key))
      ];

      setOrderedKeys(combinedOrder);
    }
  }, [menuData]);

  
/**
   * Dispara el Toast enviando el tipo y mensaje al componente visual
   */
  const showToast = (type, message) => {
  setToast({ show: true, type, message });
};

  /**
   * Oculta el Toast
   */
const hideToast = () => {
  setToast((prev) => ({ ...prev, show: false }));
};



  // Mueve una categoría hacia arriba (🔼) o hacia abajo (🔽)
  const moveCategory = (index, direction) => {
    const newOrder = [...orderedKeys];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    // Intercambia posiciones
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setOrderedKeys(newOrder);
  };

  // Guarda la nueva secuencia global en Firestore
  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, 'menu', 'spanish');
      await updateDoc(docRef, {
        categoryOrder: orderedKeys
      });
      showToast('success', '¡Nuevo orden de categorías guardado!');
    } catch (error) {
      console.error('Error al guardar categoryOrder:', error);
      showToast('error', 'Error al actualizar el orden de categorías.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    orderedKeys,
    menuData,
    isSaving,
    toast,    
    hideToast,
    moveCategory,
    handleSaveOrder
  };
};