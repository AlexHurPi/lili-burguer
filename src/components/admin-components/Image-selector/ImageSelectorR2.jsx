import React, { useState } from 'react';
import { listR2Images } from '../../../services/r2Service';
import './imageSelectorR2.css';

export const ImageSelectorR2 = ({ currentImage, onImageChange, onFileChange }) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

  // Abrir la galería R2 y cargar la lista de imágenes desde Cloudflare
  const handleOpenGallery = async () => {
    setIsGalleryOpen(true);
    setIsLoadingGallery(true);
    try {
      const images = await listR2Images();
      setGalleryImages(images);
    } catch (error) {
      console.error('Error al cargar la galería de R2:', error);
    } finally {
      setIsLoadingGallery(false);
    }
  };

  // Selección de foto local o cámara del dispositivo
  const handleLocalFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (.jpg, .png, .webp).');
      return;
    }

    const tempPreview = URL.createObjectURL(file);
    onFileChange(file, tempPreview);
  };

  // Selección de foto existente en el Bucket R2
  const handleSelectFromGallery = (url) => {
    onImageChange(url);
    setIsGalleryOpen(false);
  };

  return (
    <div className="image-selector-r2-container">
      <label className="form-section-title">🖼️ Imagen del Producto</label>
      <p className="image-recommendation-note">
        💡 Recomendación: Utiliza imágenes en formato liviano <strong>.webp</strong> optimizadas para móvil.
      </p>

      {/* Botones de Selección */}
      <div className="image-upload-actions-wrapper">
        <label className="btn-action-image btn-upload-local">
          <input
            type="file"
            accept="image/*"
            onChange={handleLocalFileSelect}
            style={{ display: 'none' }}
          />
          📷 Tomar / Subir Foto Nueva
        </label>

        <button
          type="button"
          className="btn-action-image btn-open-gallery-r2"
          onClick={handleOpenGallery}
        >
          📂 Elegir de Galería R2
        </button>
      </div>

      {/* Vista Previa de la Imagen Seleccionada */}
      {currentImage && (
        <div className="selected-image-preview-box">
          <span className="preview-label">Imagen Seleccionada:</span>
          <div className="preview-thumbnail-wrapper">
            <img src={currentImage} alt="Vista previa" className="preview-thumbnail-img" />
          </div>
        </div>
      )}

      {/* Modal de la Galería R2 */}
      {isGalleryOpen && (
        <div className="r2-media-modal-overlay">
          <div className="r2-media-modal-content">
            <div className="r2-media-modal-header">
              <h3>📂 Galería de Imágenes en Cloudflare R2</h3>
              <button
                type="button"
                className="btn-close-modal-r2"
                onClick={() => setIsGalleryOpen(false)}
              >
                ✖
              </button>
            </div>

            {isLoadingGallery ? (
              <p className="loading-gallery-text">⏳ Cargando imágenes desde Cloudflare R2...</p>
            ) : galleryImages.length === 0 ? (
              <p className="loading-gallery-text">No hay imágenes guardadas en el bucket.</p>
            ) : (
              <div className="r2-gallery-grid">
                {galleryImages.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="r2-gallery-item"
                    onClick={() => handleSelectFromGallery(imgUrl)}
                  >
                    <img src={imgUrl} alt={`R2 miniatura ${index}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};