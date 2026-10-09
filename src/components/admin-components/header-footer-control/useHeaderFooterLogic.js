import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useMenu } from '../../../context/MenuContext';
import { uploadImageToR2 } from '../../../services/r2Service'; // 👈 Importamos el servicio R2

export const useHeaderFooterLogic = () => {
  const { menuData } = useMenu();

  const [headerForm, setHeaderForm] = useState({
    title: '',
    subtitle: '',
    image: ''
  });

  const [footerForm, setFooterForm] = useState({
    empresa: '',
    slogan: '',
    razonsocial: '',
    nit: '',
    dondeestamos: '',
    ubicacion: '',
    direccion: '',
    correo: '',
    telefono: '',
    redessociales: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    twitter: '',
    youtube: '',
    final: ''
  });

  const [imageFile, setImageFile] = useState(null); // Archivo binario local si seleccionó de galería/cámara
  const [imagePreview, setImagePreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  // Sincronizar estados locales con Firestore
  useEffect(() => {
    if (menuData?.header) {
      setHeaderForm({
        title: menuData.header.title || '',
        subtitle: menuData.header.subtitle || '',
        image: menuData.header.image || ''
      });
      setImagePreview(menuData.header.image || '');
    }

    if (menuData?.footer) {
      setFooterForm({
        empresa: menuData.footer.empresa || '',
        slogan: menuData.footer.slogan || '',
        razonsocial: menuData.footer.razonsocial || '',
        nit: menuData.footer.nit || '',
        dondeestamos: menuData.footer.dondeestamos || '',
        ubicacion: menuData.footer.ubicacion || '',
        direccion: menuData.footer.direccion || '',
        correo: menuData.footer.correo || '',
        telefono: menuData.footer.telefono || '',
        redessociales: menuData.footer.redessociales || '',
        facebook: menuData.footer.facebook || '',
        instagram: menuData.footer.instagram || '',
        tiktok: menuData.footer.tiktok || '',
        twitter: menuData.footer.twitter || menuData.footer.X || '',
        youtube: menuData.footer.youtube || '',
        final: menuData.footer.final || ''
      });
    }
  }, [menuData]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 4000);
  };

  const handleHeaderChange = (field, value) => {
    setHeaderForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFooterChange = (field, value) => {
    setFooterForm((prev) => ({ ...prev, [field]: value }));
  };

  // Manejador cuando el usuario elige un archivo desde la cámara/dispositivo
  const handleFileChange = (file, tempPreview) => {
    setImageFile(file);
    setImagePreview(tempPreview);
    handleHeaderChange('image', tempPreview);
  };

  // Manejador cuando el usuario elige una imagen existente en la Galería R2
  const handleGallerySelect = (url) => {
    setImageFile(null); // Cancelamos subida binaria porque ya existe en R2
    setImagePreview(url);
    handleHeaderChange('image', url);
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalHeaderImage = headerForm.image;

      // 1. Si se seleccionó una foto local nueva, la subimos a R2
      if (imageFile) {
        finalHeaderImage = await uploadImageToR2(imageFile);
      }

      const updatedHeader = {
        ...headerForm,
        image: finalHeaderImage
      };

      // 2. Actualizamos Firestore
      const docRef = doc(db, 'menu', 'spanish');
      await updateDoc(docRef, {
        header: updatedHeader,
        footer: footerForm
      });

      setHeaderForm(updatedHeader);
      setImagePreview(finalHeaderImage);
      setImageFile(null);

      showToast('success', '¡Información institucional guardada con éxito!');
    } catch (error) {
      console.error('Error al actualizar Firestore:', error);
      showToast('error', 'Error al guardar la información.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    headerForm,
    footerForm,
    imagePreview,
    isSaving,
    toast,
    handleHeaderChange,
    handleFooterChange,
    handleFileChange,
    handleGallerySelect,
    handleSaveAll
  };
};