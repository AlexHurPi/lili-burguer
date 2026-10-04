import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './productDetails.css';
import { BackTo } from '../components/backTo-components/BackTo';

export const ProductDetails = () => {
  const { t } = useTranslation();
  const location = useLocation();

  // Recibimos la clave enviada desde el Link de Inicio (ej: "cards.card1")
  const dataKey = location.state?.dataKey || location.state?.data;

  // Obtenemos el arreglo del JSON
  const rawProducts = t(dataKey, { returnObjects: true });
  const products = Array.isArray(rawProducts) ? rawProducts : [];

  if (products.length === 0) {
    return (
      <div className="product-details-container">
        <BackTo />
        <p style={{ padding: '20px', textAlign: 'center' }}>No se encontró información del producto.</p>
      </div>
    );
  }

  // Desestructuramos la cabecera (pos 0: main-title e imagen) y la lista de platillos
  const [headerInfo, ...itemList] = products;

  const mainTitle = headerInfo?.['main-title'] || headerInfo?.title;
  const imageSrc = headerInfo?.image;

  return (
    <div className="product-details-container">
      <BackTo />

      {/* Sección de la imagen principal y título */}
      <div className="contImagenProducto">
        {mainTitle && <h1 className="Main-title">{mainTitle}</h1>}
        {imageSrc && <img src={imageSrc} alt={mainTitle || 'Imagen del producto'} />}        
      </div>

      {/* Tarjeta con los detalles del contenido */}
      <div className="product-info-card">
        {itemList.map((product, index) => (
          <React.Fragment key={index}>
            <h1 className="product-title">{product.title}</h1>

            {/* Unificación limpia de ingredientes si existen */}
            {(product.ingredient1 || product.ingredient2 || product.ingredient3 || product.ingredient4) && (
              <p className="product-description">
                {[product.ingredient1, product.ingredient2, product.ingredient3, product.ingredient4]
                  .filter(Boolean)
                  .join(' ')}
              </p>
            )}

            {product.price && (
              <div className="productoPrecio">
                <span className="current-price">
                  {product.price.includes('$') ? product.price : `$${product.price}`}
                </span>
              </div>
            )}

            <div className="product-badges">
              <span className="badge-discount">56% OFF - Sólo nuevos usuarios</span>
              <span className="badge-limit">Máximo 2</span>
            </div>

            {/* Sección de Adiciones */}
            <div className="adiciones-container">
              <div className="adiciones-header">
                <h3>Elige tus Adiciones Preferidas</h3>
                <p>Selecciona 1</p>
              </div>
              <div className="adicion-item">
                <span>Queso Americano</span>
                <div className="adicion-price">
                  <span>+$1,900</span>
                  <input type="radio" name={`adicion-${index}`} />
                </div>
              </div>
              <div className="adicion-item">
                <span>Tocineta</span>
                <div className="adicion-price">
                  <span>+$2,900</span>
                  <input type="radio" name={`adicion-${index}`} />
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Barra fija inferior */}
      <div className="bottom-action-bar">
        <div className="quantity-selector">
          <button>-</button>
          <span>1</span>
          <button>+</button>
        </div>
        <button className="btn-agregar">Agregar</button>
      </div>
    </div>
  );
};