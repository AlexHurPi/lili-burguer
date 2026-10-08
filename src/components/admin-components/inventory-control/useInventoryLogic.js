import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useMenu } from '../../../context/MenuContext';

// Helper para formatear números en caliente con punto de miles (es-CO)
export const formatCurrencyInput = (value) => {
  if (!value && value !== 0) return '';
  const cleanDigits = String(value).replace(/\D/g, '').replace(/^0+/, '');
  if (!cleanDigits) return '';
  return new Intl.NumberFormat('es-CO').format(parseInt(cleanDigits, 10));
};

// Helper para limpiar la cadena formateada a número puro antes de guardar
export const unformatCurrency = (value) => {
  if (!value) return '';
  return String(value).replace(/\D/g, '').replace(/^0+/, '');
};

export const useInventoryLogic = () => {
  const { menuData } = useMenu();
  const [cardsState, setCardsState] = useState({});
  const [openCategory, setOpenCategory] = useState(null);
  const [savingCategory, setSavingCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // { catKey, index, product }
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  // Sincronizar estado local cuando menuData cambia desde Firestore
  useEffect(() => {
    if (menuData?.cards) {
      setCardsState(JSON.parse(JSON.stringify(menuData.cards)));
      /*if (!openCategory && Object.keys(menuData.cards).length > 0) {
        setOpenCategory(Object.keys(menuData.cards)[0]);
      }*/
    }
  }, [menuData]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 4000);
  };

  const toggleCategory = (catKey) => {
    setOpenCategory(openCategory === catKey ? null : catKey);
  };

  // Cambio rápido para los switches (Stock / Available)
  const handleQuickToggle = (catKey, index, field) => {
    setCardsState((prev) => {
      const updatedCat = [...(prev[catKey] || [])];
      const currentVal = updatedCat[index][field] !== false;
      updatedCat[index] = {
        ...updatedCat[index],
        [field]: !currentVal
      };
      return { ...prev, [catKey]: updatedCat };
    });
  };

  // Actualizar un producto editado desde el Modal
  const handleUpdateProductFromModal = (updatedProduct) => {
    if (!editingItem) return;
    const { catKey, index } = editingItem;

    setCardsState((prev) => {
      const updatedCat = [...(prev[catKey] || [])];
      updatedCat[index] = updatedProduct;
      return { ...prev, [catKey]: updatedCat };
    });
    setEditingItem(null);
  };

  // Guardar una categoría completa en Firestore
  const handleSaveCategory = async (catKey) => {
    setSavingCategory(catKey);
    try {
      const docRef = doc(db, 'menu', 'spanish');
      await updateDoc(docRef, {
        [`cards.${catKey}`]: cardsState[catKey]
      });

      const catTitle = cardsState[catKey]?.[0]?.categoryTitle || catKey;
      showToast('success', `¡Categoría "${catTitle}" guardada con éxito!`);
    } catch (error) {
      console.error('Error al actualizar Firestore:', error);
      showToast('error', 'Error al guardar los cambios en Firestore.');
    } finally {
      setSavingCategory(null);
    }
  };

  return {
    cardsState,
    openCategory,
    savingCategory,
    editingItem,
    toast,
    setEditingItem,
    toggleCategory,
    handleQuickToggle,
    handleUpdateProductFromModal,
    handleSaveCategory
  };
};