import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useMenu } from '../../../context/MenuContext';

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

  // Manejo y Validación de Archivo de Imagen
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'El archivo seleccionado no es una imagen válida.');
      e.target.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    handleHeaderChange('image', previewUrl);
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const docRef = doc(db, 'menu', 'spanish');
      await updateDoc(docRef, {
        header: headerForm,
        footer: footerForm
      });

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
    setImagePreview,
    handleHeaderChange,
    handleFooterChange,
    handleFileChange,
    handleSaveAll
  };
};