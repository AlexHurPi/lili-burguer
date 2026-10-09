import React, { useState } from 'react';
import { formatCurrencyInput, unformatCurrency } from './useInventoryLogic';
import { ImageSelectorR2 } from '../image-selector/ImageSelectorR2'; 
import { uploadImageToR2 } from '../../../services/r2Service';

const DAYS_MAP = [
  { id: 0, label: 'Dom' },
  { id: 1, label: 'Lun' },
  { id: 2, label: 'Mar' },
  { id: 3, label: 'Mié' },
  { id: 4, label: 'Jue' },
  { id: 5, label: 'Vie' },
  { id: 6, label: 'Sáb' }
];

export const ProductEditModal = ({ itemData, onClose, onSave }) => {
  // Estado para controlar si la oferta está activa visualmente en el modal
  const [isPromoActive, setIsPromoActive] = useState(Boolean(itemData.product.offerPrice));
  
  // Manejo de archivo de imagen local seleccionado para subida posterior a R2
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    ...itemData.product,
    // Mantenemos order como string para permitir borrar libremente en el input
    order: itemData.product.order !== undefined && itemData.product.order !== null 
      ? String(itemData.product.order) 
      : '1',
    regularPrice: formatCurrencyInput(itemData.product.regularPrice),
    offerPrice: formatCurrencyInput(itemData.product.offerPrice),
    days: itemData.product.days || [],
    image: itemData.product.image || ''
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (field, rawValue) => {
    const formatted = formatCurrencyInput(rawValue);
    setFormData((prev) => ({ ...prev, [field]: formatted }));
  };

  // Alternar switch de oferta activa
  const handleTogglePromo = (e) => {
    const active = e.target.checked;
    setIsPromoActive(active);
    if (!active) {
      setFormData((prev) => ({
        ...prev,
        offerPrice: '',
        discountBadge: '',
        badgeText: ''
      }));
    }
  };

  const handleDayToggle = (dayId) => {
    setFormData((prev) => {
      const currentDays = prev.days || [];
      const exists = currentDays.includes(dayId);
      const newDays = exists
        ? currentDays.filter((d) => d !== dayId)
        : [...currentDays, dayId].sort();
      return { ...prev, days: newDays };
    });
  };

  // Manejador del cambio de imagen desde el componente ImageSelectorR2
  const handleImageChange = (newUrl) => {
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, image: newUrl }));
  };

  const handleFileChange = (file, tempPreview) => {
    setSelectedFile(file);
    setFormData((prev) => ({ ...prev, image: tempPreview }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let finalImageUrl = formData.image;

      // Si el usuario seleccionó una foto local de su dispositivo, la subimos a R2 ahora
      if (selectedFile) {
        finalImageUrl = await uploadImageToR2(selectedFile);
      }

      // Si el usuario borró el input y quedó vacío, se le asigna 9999
      // para que al ordenar (.sort((a, b) => a.order - b.order)) se ubique de último
      const parsedOrder = formData.order.trim() === '' ? 9999 : Number(formData.order);

      const finalProduct = {
        ...formData,
        order: isNaN(parsedOrder) ? 9999 : parsedOrder,
        regularPrice: formatCurrencyInput(formData.regularPrice),
        offerPrice: isPromoActive ? formatCurrencyInput(formData.offerPrice) : '',
        discountBadge: isPromoActive ? formData.discountBadge : '',
        badgeText: isPromoActive ? formData.badgeText : '',
        days: isPromoActive ? formData.days : [],
        startHour: isPromoActive ? formData.startHour : '',
        endHour: isPromoActive ? formData.endHour : '',
        image: finalImageUrl
      };

      onSave(finalProduct);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      alert('Error al subir la imagen a Cloudflare R2.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <div className="modal-header">
          <h3>✏️ Editar Producto</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>✖</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-body">
          {/* Información Principal */}
          <div className="form-group">
            <label>Título del Producto:</label>
            <input
              type="text"
              value={formData.productTitle || ''}
              onChange={(e) => handleChange('productTitle', e.target.value)}
              placeholder="Ej: Clásica Sencilla"
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción / Ingredientes:</label>
            <textarea
              rows="3"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Ej: Pan mantequilla, queso mozzarella, tocineta..."
            />
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <label>Orden de Aparición:</label>
              <input
                type="text"
                inputMode="numeric"
                value={formData.order}
                onChange={(e) => handleChange('order', e.target.value.replace(/\D/g, ''))}
                placeholder="Ej: 1 (Dejar vacío para enviar al final)"
              />
            </div>

            <div className="form-group">
              <label>Precio Regular ($):</label>
              <input
                type="text"
                inputMode="numeric"
                value={formData.regularPrice || ''}
                onChange={(e) => handlePriceChange('regularPrice', e.target.value)}
                placeholder="18.000"
                required
              />
            </div>
          </div>

          {/* Subcomponente Gestor de Imagen R2 */}
          <ImageSelectorR2
            currentImage={formData.image}
            onImageChange={handleImageChange}
            onFileChange={handleFileChange}
          />

          {/* Bloque de Promoción / Oferta con Switch */}
          <div className="promo-section-header">
            <span className="form-section-title">🔥 Configuración de Oferta / Promoción</span>
            <label className="switch-control-mini" title="Activar / Desactivar Promoción">
              <input
                type="checkbox"
                checked={isPromoActive}
                onChange={handleTogglePromo}
              />
              <span className="slider-mini"></span>
            </label>
          </div>

          <div className={`promo-block-wrapper ${!isPromoActive ? 'promo-disabled' : ''}`}>
            <div className="form-row-two">
              <div className="form-group">
                <label>Precio Oferta ($):</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.offerPrice || ''}
                  onChange={(e) => handlePriceChange('offerPrice', e.target.value)}
                  placeholder="12.000"
                  required={isPromoActive}
                  disabled={!isPromoActive}
                />
              </div>

              <div className="form-group">
                <label>Etiqueta Especial:</label>
                <input
                  type="text"
                  value={formData.badgeText || ''}
                  onChange={(e) => handleChange('badgeText', e.target.value)}
                  placeholder="OFERTA ESPECIAL"
                  required={isPromoActive}
                  disabled={!isPromoActive}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Badge Descuento (Opcional):</label>
              <input
                type="text"
                value={formData.discountBadge || ''}
                onChange={(e) => handleChange('discountBadge', e.target.value)}
                placeholder="33% OFF"
                disabled={!isPromoActive}
              />
            </div>

            {/* Días y Horarios */}
            <label style={{ display: 'block', fontSize: '0.85rem', marginTop: '10px' }}>
              📅 Días y Horarios de Promoción:
            </label>
            <div className="days-selector-grid">
              {DAYS_MAP.map((day) => {
                const active = formData.days?.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    className={`day-chip ${active ? 'active' : ''}`}
                    onClick={() => isPromoActive && handleDayToggle(day.id)}
                    disabled={!isPromoActive}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>

            <div className="form-row-two" style={{ marginTop: '10px' }}>
              <div className="form-group">
                <label>Hora Inicio:</label>
                <input
                  type="time"
                  value={formData.startHour || ''}
                  onChange={(e) => handleChange('startHour', e.target.value)}
                  disabled={!isPromoActive}
                />
              </div>

              <div className="form-group">
                <label>Hora Fin:</label>
                <input
                  type="time"
                  value={formData.endHour || ''}
                  onChange={(e) => handleChange('endHour', e.target.value)}
                  disabled={!isPromoActive}
                />
              </div>
            </div>

            {/* Nota aclaratoria 24/7 */}
            <p className="promo-247-note">
              💡 <em>Nota: Si no seleccionas días ni horarios específicos, la oferta estará activa las 24 horas del día, los 7 días de la semana.</em>
            </p>
          </div>

          <div className="modal-actions-footer">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-modal-save"
              disabled={isUploading}
            >
              {isUploading ? '⌛ Subiendo foto...' : '✓ Aplicar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};