import React, { useState } from 'react';
import { formatCurrencyInput, unformatCurrency } from './useInventoryLogic';

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
  const [formData, setFormData] = useState({
    ...itemData.product,
    regularPrice: formatCurrencyInput(itemData.product.regularPrice),
    offerPrice: formatCurrencyInput(itemData.product.offerPrice),
    days: itemData.product.days || []
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (field, rawValue) => {
    const formatted = formatCurrencyInput(rawValue);
    setFormData((prev) => ({ ...prev, [field]: formatted }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalProduct = {
      ...formData,
      order: Number(formData.order) || 1,
      regularPrice: formatCurrencyInput(formData.regularPrice),
      offerPrice: formatCurrencyInput(formData.offerPrice)
    };
    onSave(finalProduct);
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
                value={formData.order || 1}
                onChange={(e) => handleChange('order', e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>

          {/* Sección de Precios */}
          <div className="form-section-title">💰 Configuración de Precios</div>
          <div className="form-row-two">
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

            <div className="form-group">
              <label>Precio Oferta ($):</label>
              <input
                type="text"
                inputMode="numeric"
                value={formData.offerPrice || ''}
                onChange={(e) => handlePriceChange('offerPrice', e.target.value)}
                placeholder="12.000 (Opcional)"
              />
            </div>
          </div>

          {/* Sección de Badges y Etiquetas */}
          <div className="form-section-title">🏷️ Badges y Etiquetas</div>
          <div className="form-row-two">
            <div className="form-group">
              <label>Badge Descuento:</label>
              <input
                type="text"
                value={formData.discountBadge || ''}
                onChange={(e) => handleChange('discountBadge', e.target.value)}
                placeholder="33% OFF"
              />
            </div>

            <div className="form-group">
              <label>Etiqueta Especial:</label>
              <input
                type="text"
                value={formData.badgeText || ''}
                onChange={(e) => handleChange('badgeText', e.target.value)}
                placeholder="OFERTA ESPECIAL"
              />
            </div>
          </div>

          {/* Sección de Horarios de Oferta */}
          <div className="form-section-title">📅 Días y Horarios de Promoción</div>
          <div className="days-selector-grid">
            {DAYS_MAP.map((day) => {
              const active = formData.days?.includes(day.id);
              return (
                <button
                  key={day.id}
                  type="button"
                  className={`day-chip ${active ? 'active' : ''}`}
                  onClick={() => handleDayToggle(day.id)}
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
              />
            </div>

            <div className="form-group">
              <label>Hora Fin:</label>
              <input
                type="time"
                value={formData.endHour || ''}
                onChange={(e) => handleChange('endHour', e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions-footer">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-modal-save">
              ✓ Aplicar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};