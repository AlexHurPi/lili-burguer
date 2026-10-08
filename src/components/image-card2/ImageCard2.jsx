import React, { useState } from 'react';
import './imageCard2-styles.css';
import { useMenu } from '../../context/MenuContext';
import { useCart } from '../../context/CartContext.jsx';

// Helper para verificar si la promoción está activa en fecha y hora actual
const checkIsPromoActive = (product) => {
  if (
    !product?.offerPrice ||
    product.offerPrice.trim() === '' ||
    !Array.isArray(product?.days) ||
    product.days.length === 0
  ) {
    return false;
  }

  const now = new Date();
  const currentDay = now.getDay(); // 0 (Domingo) a 6 (Sábado)

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;

  const isDayValid = product.days.includes(currentDay);
  const isTimeValid =
    (!product.startHour || currentTime >= product.startHour) &&
    (!product.endHour || currentTime <= product.endHour);

  return isDayValid && isTimeValid;
};

const ProductItem = ({ product }) => {
  const [cantidad, setCantidad] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const { agregarAlCarrito } = useCart();

  // 1. Borrado Lógico: Si no está disponible, no renderizamos nada
  if (product.available === false) return null;

  // 2. Control de Stock (Disponibilidad inmediata)
  const isStock = product.stock !== false;

  // 3. Promoción activa (solo si hay stock)
  const isPromo = isStock && checkIsPromoActive(product);

  // 4. Precio vigente
  const precioActual =
    isPromo && product.offerPrice && product.offerPrice.trim() !== ''
      ? product.offerPrice
      : product.regularPrice;

  const handleIncrement = () => {
    if (isStock) setCantidad(cantidad + 1);
  };

  const handleDecrement = () => {
    if (isStock && cantidad > 0) setCantidad(cantidad - 1);
  };

  const handleAddToCart = () => {
    if (isStock && cantidad > 0) {
      agregarAlCarrito({ id: product.id }, cantidad);
      setCantidad(0);

      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 1800);
    }
  };

  return (
    <div
      className={`product-card ${!isStock ? 'product-card-out-of-stock' : ''} ${
        isPromo ? 'product-card-promo' : ''
      }`}
    >
      {/* Toast Flotante */}
      {isAdded && (
        <div className="cart-toast-notification">
          <span>✅ ¡Producto agregado al carrito!</span>
        </div>
      )}

      {/* Badges de Promoción o Agotado */}
      {!isStock ? (
        <div className="stock-badge-out">AGOTADO</div>
      ) : isPromo ? (
        <div className="promo-badge-container">
          {product.badgeText && <span className="promo-badge-text">{product.badgeText}</span>}
          {product.discountBadge && <span className="promo-badge-discount">{product.discountBadge}</span>}
        </div>
      ) : null}

      <div className="product-info">
        {product.image && (
          <div className="product-image">
            <img src={product.image} alt={product.productTitle || 'Imagen producto'} />
            {!isStock && <div className="out-of-stock-overlay">NO DISPONIBLE</div>}
          </div>
        )}
        <div className="product-text">
          <h4 className="product-title">{product.productTitle}</h4>
          {product.description && (
            <p className="product-description">{product.description}</p>
          )}
        </div>
      </div>

      <div className="price-quantity-row">
        <div className="price-container">
          <span className="product-price">
            {precioActual?.includes('$') ? precioActual : `$ ${precioActual}`}
          </span>
          {isPromo && product.regularPrice && (
            <span className="product-old-price">
              {product.regularPrice.includes('$') ? product.regularPrice : `$ ${product.regularPrice}`}
            </span>
          )}
        </div>

        <div className="custom-qty-controls">
          <button
            className="qty-btn minus"
            onClick={handleDecrement}
            disabled={!isStock || cantidad === 0 || isAdded}
          >
            -
          </button>
          <span className="qty-mainPAge-number">{cantidad}</span>
          <button
            className="qty-btn plus"
            onClick={handleIncrement}
            disabled={!isStock || isAdded}
          >
            +
          </button>
        </div>
      </div>

      <button
        className={`btn-add-to-cart ${!isStock ? 'btn-disabled' : ''} ${
          isAdded ? 'btn-added' : ''
        }`}
        onClick={handleAddToCart}
        disabled={!isStock || cantidad === 0 || isAdded}
      >
        {!isStock ? '🚫 AGOTADO' : isAdded ? '✅ ¡AGREGADO!' : '🛒 AGREGAR AL CARRITO'}
      </button>
    </div>
  );
};

// COMPONENTE PRINCIPAL
const ImageCard2 = ({ dataKey }) => {
  const { menuData } = useMenu();

  // Extraemos la categoría (ej: "card1" desde "cards.card1")
  const [_, categoryKey] = dataKey.split('.');
  const rawProducts = menuData?.cards?.[categoryKey] || [];

  // 1. Filtramos los disponibles
  const visibleProducts = rawProducts.filter((product) => product.available !== false);

  if (visibleProducts.length === 0) return null;

  // 2. ORDENAMIENTO DINÁMICO: Por 'order' y desempate alfabético por 'productTitle'
  const sortedProducts = [...visibleProducts].sort((a, b) => {
    const orderA = a.order !== undefined && a.order !== null ? Number(a.order) : 9999;
    const orderB = b.order !== undefined && b.order !== null ? Number(b.order) : 9999;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    const titleA = (a.productTitle || '').toLowerCase();
    const titleB = (b.productTitle || '').toLowerCase();
    return titleA.localeCompare(titleB);
  });

  const categoryTitle = sortedProducts[0]?.categoryTitle || rawProducts[0]?.categoryTitle;

  return (
    <div className="imageCard2-mainContainer">
      {categoryTitle && (
        <div className="category-header">
          <h3>{categoryTitle.toUpperCase()}</h3>
        </div>
      )}
      <div className="products-container">
        {sortedProducts.map((product) => (
          <ProductItem key={product.id || product.productTitle} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ImageCard2;