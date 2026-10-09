import { useState, useEffect } from 'react';
import { db } from '../../../services/firebase';
import { useMenu } from '../../../context/MenuContext';
import { listR2Images, uploadImageToR2 } from '../../../services/r2Service';
import { doc, updateDoc, arrayUnion, deleteField, arrayRemove } from 'firebase/firestore';

// Hook personalizado
export const useProductCatalogLogic = () => {
  const { menuData } = useMenu();

  // Estado del formulario de creación
  const [formData, setFormData] = useState({
    categoryKey: 'card1', // Categoría seleccionada por defecto
    isNewCategory: false,
    newCategoryTitle: '',
    productTitle: '',
    description: '',
    regularPrice: '',
    offerPrice: '',
    badgeText: '',
    discountBadge: '',
    imageUrl: '',
  });

  // Estados de subida y archivos
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  // Estados para la Galería de Medios R2
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

  // Lista de categorías existentes para el selector
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    if (menuData?.cards) {
      const keys = Object.keys(menuData.cards).sort((a, b) => {
        const orderList = menuData?.categoryOrder || [];
        const indexA = orderList.indexOf(a);
        const indexB = orderList.indexOf(b);

        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
      });

      const list = keys.map((key) => {
        const catProducts = menuData.cards[key] || [];
        const title = catProducts[0]?.categoryTitle || `Categoría ${key}`;
        return { key, title };
      });

      setCategoriesList(list);
      if (list.length > 0 && !formData.categoryKey) {
        setFormData((prev) => ({ ...prev, categoryKey: list[0].key }));
      }
    }
  }, [menuData]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 4000);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'imageUrl' && imageFile) {
      setImageFile(null);
      setImagePreview(value);
    }
  };

  const handleFileChange = (file, tempPreview) => {
    // 1. Verificamos que el componente nos haya enviado un archivo
    if (!file) return;

    // 2. Validamos el tipo
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Por favor selecciona un archivo de imagen válido (.jpg, .png, .webp).');
      return;
    }

    // 3. Sincronizamos los estados correctamente
    setImageFile(file);
    setImagePreview(tempPreview);
    setFormData((prev) => ({ ...prev, imageUrl: tempPreview }));
  };

  const handleOpenGallery = async () => {
    setIsGalleryOpen(true);
    setIsLoadingGallery(true);
    try {
      const images = await listR2Images();
      setGalleryImages(images);
    } catch (error) {
      showToast('error', 'No se pudieron cargar las imágenes de Cloudflare R2.');
    } finally {
      setIsLoadingGallery(false);
    }
  };

  const handleSelectFromGallery = (url) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    setImagePreview(url);
    setImageFile(null); // Al seleccionar de R2, cancelamos la subida de archivo local
    setIsGalleryOpen(false);
  };

  // Crear Producto Nuevo y/o Nueva Categoría
  const handleCreateProduct = async (e) => {
    e.preventDefault();

    if (!formData.productTitle.trim()) {
      showToast('error', 'El nombre del producto es obligatorio.');
      return;
    }

    if (formData.isNewCategory && !formData.newCategoryTitle.trim()) {
      showToast('error', 'Escribe el nombre de la nueva categoría.');
      return;
    }

    setIsSaving(true);

    try {
      let finalImageUrl = formData.imageUrl.trim();

      // 1. Subir imagen a R2 / Storage si se seleccionó un archivo local
      if (imageFile) {
        setIsUploading(true);
        finalImageUrl = await uploadImageToR2(imageFile);
        setIsUploading(false);
      }

      // 2. Determinar la clave de la categoría y su título
      let targetCatKey = formData.categoryKey;
      let categoryTitle = '';
      const currentCards = menuData?.cards || {};

      if (formData.isNewCategory) {
        // Generar una clave única buscando el número más alto existente (ej: card16)
        const existingNumbers = Object.keys(currentCards).map((k) =>
          parseInt(k.replace(/\D/g, ''), 10) || 0
        );
        const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
        targetCatKey = `card${maxNum + 1}`;
        categoryTitle = formData.newCategoryTitle.trim();
      } else {
        categoryTitle =
          currentCards[targetCatKey]?.[0]?.categoryTitle ||
          categoriesList.find((c) => c.key === targetCatKey)?.title ||
          'General';
      }

      const existingProducts = currentCards[targetCatKey] || [];

      // 3. Construir el objeto del nuevo producto
      const newProduct = {
        id: `prod_${Date.now()}`,
        order: existingProducts.length + 1,
        available: true,
        stock: true,
        categoryTitle: categoryTitle,
        productTitle: formData.productTitle.trim(),
        description: formData.description.trim(),
        regularPrice: formData.regularPrice.trim(),
        offerPrice: formData.offerPrice.trim(),
        badgeText: formData.badgeText.trim(),
        discountBadge: formData.discountBadge.trim(),
        image: finalImageUrl || './images/products/default.webp',
        days: [0, 1, 2, 3, 4, 5, 6],
        startHour: '',
        endHour: ''
      };

      const updatedCategoryArray = [...existingProducts, newProduct];

      // 4. Preparar payload y actualizar Firestore
      const docRef = doc(db, 'menu', 'spanish');
      const updateData = {
        [`cards.${targetCatKey}`]: updatedCategoryArray
      };

      // Si es una categoría nueva, agregamos la clave a la secuencia global categoryOrder
      if (formData.isNewCategory) {
        updateData.categoryOrder = arrayUnion(targetCatKey);
      }

      await updateDoc(docRef, updateData);

      showToast('success', `¡Producto "${newProduct.productTitle}" guardado con éxito!`);

      // Resetear el formulario
      setFormData({
        categoryKey: targetCatKey,
        isNewCategory: false,
        newCategoryTitle: '',
        productTitle: '',
        description: '',
        regularPrice: '',
        offerPrice: '',
        badgeText: '',
        discountBadge: '',
        imageUrl: ''
      });
      setImageFile(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error al crear el producto o categoría:', error);
      showToast('error', 'Error al guardar en Firestore.');
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleDeleteProduct = async (catKey, productId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto definitivamente del menú?')) {
      return;
    }

    setDeletingId(productId);
    try {
      const currentCategory = menuData?.cards?.[catKey] || [];
      const updatedCategory = currentCategory.filter((item) => item.id !== productId);

      const docRef = doc(db, 'menu', 'spanish');
      await updateDoc(docRef, {
        [`cards.${catKey}`]: updatedCategory
      });

      showToast('success', 'Producto eliminado del catálogo correctamente.');
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      showToast('error', 'No se pudo eliminar el producto de Firestore.');
    } finally {
      setDeletingId(null);
    }
  };
// Nueva función para eliminar una categoría entera
        const handleDeleteCategory = async (catKey, catTitle) => {
      if (!window.confirm(`⚠️ PELIGRO: ¿Estás seguro de que deseas eliminar TODA la categoría "${catTitle}"...?`)) {
        return;
      }

      try {
        const docRef = doc(db, 'menu', 'spanish');
        
        // 👇 REVISA ESTA PARTE EXACTAMENTE:
        await updateDoc(docRef, {
          [`cards.${catKey}`]: deleteField(),
          categoryOrder: arrayRemove(catKey)
        });

        showToast('success', `Categoría "${catTitle}" eliminada correctamente.`);
      } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        showToast('error', 'No se pudo eliminar la categoría.');
      }
    };
  return {
    formData,
    categoriesList,
    imagePreview,
    isUploading,
    isSaving,
    deletingId,
    toast,
    handleInputChange,
    handleFileChange,
    handleCreateProduct,
    handleDeleteProduct,
    isGalleryOpen,
    galleryImages,
    isLoadingGallery,
    setIsGalleryOpen,
    handleOpenGallery,
    handleSelectFromGallery,
    handleDeleteCategory
  };
};