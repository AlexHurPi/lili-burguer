import React from 'react';
import { useHeaderFooterLogic } from './useHeaderFooterLogic';
import './headerFooterControl.css';

const HeaderFooterControl = () => {
  const {
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
  } = useHeaderFooterLogic();

  return (
    <div className="hf-control-card">
      {/* Toast Flotante */}
      {toast.show && (
        <div className={`hf-toast-floating ${toast.type}`}>
          <span>{toast.type === 'success' ? '✅' : '⚠'} {toast.message}</span>
        </div>
      )}

      <div className="hf-header">
        <h2>🎨 Identidad de Marca e Información Institucional</h2>
        <p>Ajusta los títulos del encabezado, datos de contacto y redes sociales de tu sitio web.</p>
      </div>

      <form onSubmit={handleSaveAll} className="hf-form-body">
        {/* Sección 1: Encabezado Principal */}
        <div className="hf-form-section">
          <h3 className="section-title">🖼️ Encabezado Principal (Header)</h3>
          
          <div className="form-row-two">
            <div className="hf-form-group">
              <label>Título de la Marca:</label>
              <input
                type="text"
                value={headerForm.title}
                onChange={(e) => handleHeaderChange('title', e.target.value)}
                placeholder="Ej: Lili-Hamburger"
                required
              />
            </div>

            <div className="hf-form-group">
              <label>Slogan / Subtítulo:</label>
              <input
                type="text"
                value={headerForm.subtitle}
                onChange={(e) => handleHeaderChange('subtitle', e.target.value)}
                placeholder="Ej: TU ANTOJO, AL INSTANTICO"
              />
            </div>
          </div>

          <div className="hf-form-group">
            <label>Imagen del Encabezado:</label>
            
            <div className="file-format-notice">
              ⚡ <strong>Recomendación:</strong> Utiliza preferiblemente formato <code>.webp</code> e imágenes livianas (menos de 300 KB) para asegurar una carga ultra rápida en celulares.
            </div>

            <div className="image-uploader-wrapper">
              <input
                type="file"
                id="header-image-input"                                             
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              <label htmlFor="header-image-input" className="btn-upload-label">
                📷 Seleccionar de Galería / Tomar Foto
              </label>

              <input
                type="text"
                value={headerForm.image}
                readOnly
                onChange={(e) => {
                  handleHeaderChange('image', e.target.value);
                  setImagePreview(e.target.value);
                }}
                placeholder="O pega la URL directa de la imagen: ./images/Encabezado.webp"
                className="input-url-fallback"
              />
            </div>

            {(imagePreview || headerForm.image) && (
              <div className="header-preview-box">
                <span>Vista Previa:</span>
                <img
                  src={imagePreview || headerForm.image}
                  alt="Vista previa del encabezado"
                  className="header-preview-img"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
            )}
          </div>
        </div>

        {/* Sección 2: Información General de la Empresa */}
        <div className="hf-form-section">
          <h3 className="section-title">🏢 Datos Generales de la Empresa</h3>
          
          <div className="form-row-two">
            <div className="hf-form-group">
              <label>Nombre Comercial (Empresa):</label>
              <input
                type="text"
                value={footerForm.empresa}
                onChange={(e) => handleFooterChange('empresa', e.target.value)}
                placeholder="Ej: Lili-Hamburger"
              />
            </div>

            <div className="hf-form-group">
              <label>Eslogan Secundario:</label>
              <input
                type="text"
                value={footerForm.slogan}
                onChange={(e) => handleFooterChange('slogan', e.target.value)}
                placeholder="Ej: Tu antojo, al instante"
              />
            </div>
          </div>

          <div className="form-row-two">
            <div className="hf-form-group">
              <label>Razón Social (Opcional):</label>
              <input
                type="text"
                value={footerForm.razonsocial}
                onChange={(e) => handleFooterChange('razonsocial', e.target.value)}
                placeholder="Ej: Lili Hamburger S.A.S."
              />
            </div>

            <div className="hf-form-group">
              <label>NIT / Identificación Fiscal:</label>
              <input
                type="text"
                value={footerForm.nit}
                onChange={(e) => handleFooterChange('nit', e.target.value)}
                placeholder="Ej: 900.123.456-7"
              />
            </div>
          </div>
        </div>

        {/* Sección 3: Ubicación y Contacto */}
        <div className="hf-form-section">
          <h3 className="section-title">📍 Ubicación y Canales de Contacto</h3>
          
          <div className="form-row-two">
            <div className="hf-form-group">
              <label>Título Sección Ubicación:</label>
              <input
                type="text"
                value={footerForm.dondeestamos}
                onChange={(e) => handleFooterChange('dondeestamos', e.target.value)}
                placeholder="Ej: ¿Dónde estamos?"
              />
            </div>

            <div className="hf-form-group">
              <label>Teléfono Visible de Contacto:</label>
              <input
                type="text"
                value={footerForm.telefono}
                onChange={(e) => handleFooterChange('telefono', e.target.value)}
                placeholder="Ej: Teléfono: +57 3228737508"
              />
            </div>
          </div>

          <div className="hf-form-group">
            <label>Descripción de Ubicación / Cobertura:</label>
            <textarea
              rows="2"
              value={footerForm.ubicacion}
              onChange={(e) => handleFooterChange('ubicacion', e.target.value)}
              placeholder="Ej: Somos una tienda virtual ubicada en el norte de Cali..."
            />
          </div>

          <div className="form-row-two">
            <div className="hf-form-group">
              <label>Dirección Física (Si aplica):</label>
              <input
                type="text"
                value={footerForm.direccion}
                onChange={(e) => handleFooterChange('direccion', e.target.value)}
                placeholder="Ej: Calle 15 # 4-20"
              />
            </div>

            <div className="hf-form-group">
              <label>Correo Electrónico de Servicio:</label>
              <input
                type="email"
                value={footerForm.correo}
                onChange={(e) => handleFooterChange('correo', e.target.value)}
                placeholder="Ej: contacto@lilihamburger.com"
              />
            </div>
          </div>
        </div>

        {/* Sección 4: Redes Sociales */}
        <div className="hf-form-section">
          <h3 className="section-title">🌐 Enlaces a Redes Sociales</h3>
          
          <div className="hf-form-group">
            <label>Encabezado Sección Redes:</label>
            <input
              type="text"
              value={footerForm.redessociales}
              onChange={(e) => handleFooterChange('redessociales', e.target.value)}
              placeholder="Ej: Síguenos en nuestras redes sociales:"
            />
          </div>

          <div className="form-row-two">
            <div className="hf-form-group">
              <label>Facebook URL:</label>
              <input
                type="url"
                value={footerForm.facebook}
                onChange={(e) => handleFooterChange('facebook', e.target.value)}
                placeholder="https://www.facebook.com/..."
              />
            </div>

            <div className="hf-form-group">
              <label>Instagram URL:</label>
              <input
                type="url"
                value={footerForm.instagram}
                onChange={(e) => handleFooterChange('instagram', e.target.value)}
                placeholder="https://www.instagram.com/..."
              />
            </div>
          </div>

          <div className="form-row-two">
            <div className="hf-form-group">
              <label>TikTok URL:</label>
              <input
                type="url"
                value={footerForm.tiktok}
                onChange={(e) => handleFooterChange('tiktok', e.target.value)}
                placeholder="https://www.tiktok.com/@..."
              />
            </div>

            <div className="hf-form-group">
              <label>Twitter / X URL:</label>
              <input
                type="url"
                value={footerForm.twitter}
                onChange={(e) => handleFooterChange('twitter', e.target.value)}
                placeholder="https://x.com/..."
              />
            </div>
          </div>

          <div className="hf-form-group">
            <label>YouTube URL:</label>
            <input
              type="url"
              value={footerForm.youtube}
              onChange={(e) => handleFooterChange('youtube', e.target.value)}
              placeholder="https://www.youtube.com/..."
            />
          </div>
        </div>

        {/* Sección 5: Cierre de Pie de Página */}
        <div className="hf-form-section">
          <h3 className="section-title">©️ Texto de Copyright (Footer Final)</h3>
          <div className="hf-form-group">
            <label>Texto Copyright Final:</label>
            <input
              type="text"
              value={footerForm.final}
              onChange={(e) => handleFooterChange('final', e.target.value)}
              placeholder="Ej: Lili-Hamburger."
            />
          </div>
        </div>

        {/* Botón de Guardado */}
        <div className="hf-submit-footer">
          <button type="submit" className="btn-save-hf" disabled={isSaving}>
            {isSaving ? (
              <span className="spinner-loading">⌛ Guardando en Firestore...</span>
            ) : (
              '💾 GUARDAR INFORMACIÓN DE MARCA'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HeaderFooterControl;