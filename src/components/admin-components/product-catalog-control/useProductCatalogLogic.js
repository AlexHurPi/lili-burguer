import { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useMenu } from '../../../context/MenuContext';
import { listR2Images, uploadImageToR2 } from '../../../services/r2Service';


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

  // 📂 Estados para la Galería de Medios R2
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

  // Lista de categorías existentes para el selector
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    if (menuData?.cards) {
      const keys = Object.keys(menuData.cards).sort((a, b) => {
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

  // Abrir modal y cargar lista de imágenes desde Cloudflare
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

  // Seleccionar una foto de la Galería R2
  const handleSelectFromGallery = (url) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    setImagePreview(url);
    setImageFile(null); // Al seleccionar de R2, cancelamos la subida de archivo local
    setIsGalleryOpen(false);
  };
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 4000);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Si el usuario escribe o pega manualmente una URL, limpiamos la selección de archivo local
    if (field === 'imageUrl' && imageFile) {
      setImageFile(null);
      setImagePreview(value);
    }
  };

  // Validación y previsualización de imagen elegida
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Por favor selecciona un archivo de imagen válido (.jpg, .png, .webp).');
      e.target.value = '';
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // 🎯 Sincroniza la URL/previsualización en la caja de texto del formulario
    setFormData((prev) => ({ ...prev, imageUrl: previewUrl }));
  };

  // Crear Producto Nuevo
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
    // Dentro de la función que guarda el producto con una categoría NUEVA:
    if (formData.isNewCategory) {
      const newCategoryKey = getNextCategoryKey(); // ej: 'card16'

      await updateDoc(doc(db, "menu", "spanish"), {
        [`cards.${newCategoryKey}`]: [newProductObj],
        categoryOrder: arrayUnion(newCategoryKey) // 👈 Agrega la nueva categoría al final de la secuencia
      });
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

      // 2. Determinar la clave de la categoría
      let targetCatKey = formData.categoryKey;
      let categoryTitle = '';

      const currentCards = menuData?.cards || {};

      if (formData.isNewCategory) {
        const nextNum = Object.keys(currentCards).length + 1;
        targetCatKey = `card${nextNum}`;
        categoryTitle = formData.newCategoryTitle.trim();
      } else {
        categoryTitle =
          currentCards[targetCatKey]?.[0]?.categoryTitle ||
          categoriesList.find((c) => c.key === targetCatKey)?.title ||
          'General';
      }

      const existingProducts = currentCards[targetCatKey] || [];

      // 3. Construir el nuevo objeto de producto
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

      // 4. Actualizar Firestore
      const docRef = doc(db, 'menu', 'spanish');
      await updateDoc(docRef, {
        [`cards.${targetCatKey}`]: updatedCategoryArray
      });

      showToast('success', `¡Producto "${newProduct.productTitle}" agregado con éxito!`);

      // Resetear formulario
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
      console.error('Error al crear el producto:', error);
      showToast('error', 'Error al guardar el nuevo producto en Firestore.');
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  // Eliminar un producto definitivamente
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
    handleSelectFromGallery
  };
};