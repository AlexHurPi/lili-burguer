import React, { useState, useRef } from 'react';
import './promoCarousel-styles.css';
import { useCart } from '../../context/CartContext.jsx';
import { useMenu } from '../../context/MenuContext.jsx'; // 👈 Leemos desde Firebase

// Helper para verificar si la promoción de un producto está activa hoy y ahora
const checkIsPromoActive = (product) => {
  if (!product?.offerPrice || product.offerPrice.trim() === '' || !Array.isArray(product?.days) || product.days.length === 0) {
    return false;
  }

  const now = new Date();
  const currentDay = now.getDay(); // 0 (Domingo) a 6 (Sábado)

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;

  // Aseguramos conversión a número para evitar discrepancias de tipo
  const validDays = product.days.map((d) => Number(d));
  const isDayValid = validDays.includes(currentDay);
  const isTimeValid =
    (!product.startHour || currentTime >= product.startHour) &&
    (!product.endHour || currentTime <= product.endHour);

  return isDayValid && isTimeValid;
};

// Sub-componente para la tarjeta de promoción individual
const PromoCardItem = ({ product }) => {
  const [cantidad, setCantidad] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const { agregarAlCarrito } = useCart();

  const handleIncrement = () => setCantidad((prev) => prev + 1);
  const handleDecrement = () => {
    if (cantidad > 0) setCantidad((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (cantidad > 0) {
      agregarAlCarrito({ id: product.id }, cantidad);
      setCantidad(0);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1800);
    }
  };

  return (
    <div className="promo-card-slide">
      {/* Badges de oferta flotantes */}
      <div className="promo-badges-wrapper">
        {product.badgeText && <span className="promo-badge-tag">{product.badgeText}</span>}
        {product.discountBadge && <span className="promo-badge-off">{product.discountBadge}</span>}
      </div>

      <div className="promo-card-body">
        {product.image && (
          <div className="promo-image-container">
            <img src={product.image} alt={product.productTitle || 'Promoción'} loading="lazy" />
          </div>
        )}

        <div className="promo-details">
          <h4 className="promo-title">{product.productTitle}</h4>
          {product.description && (
            <p className="promo-description">{product.description}</p>
          )}

          <div className="promo-price-row">
            <span className="promo-current-price">
              {product.offerPrice?.includes('$') ? product.offerPrice : `$${product.offerPrice}`}
            </span>
            {product.regularPrice && (
              <span className="promo-old-price">
                {product.regularPrice.includes('$') ? product.regularPrice : `$${product.regularPrice}`}
              </span>
            )}
          </div>

          <div className="promo-actions-row">
            <div className="promo-qty-controls">
              <button className="promo-qty-btn minus" onClick={handleDecrement}>-</button>
              <span className="promo-qty-number">{cantidad}</span>
              <button className="promo-qty-btn plus" onClick={handleIncrement}>+</button>
            </div>

            <button
              className={`promo-btn-add ${isAdded ? 'btn-added' : ''}`}
              onClick={handleAddToCart}
              disabled={cantidad === 0}
            >
              {isAdded ? '✅ ¡AGREGADO!' : '🛒 AGREGAR'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// COMPONENTE PRINCIPAL CARRUSEL DE PROMOCIONES
const PromoCarousel = () => {
  const { menuData } = useMenu(); // 👈 Leemos menuData directamente
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  // Extraemos todos los ítems de las categorías de Firestore que tengan promo activa
  const activePromos = [];
  const cardsObj = menuData?.cards || {};

  Object.values(cardsObj).forEach((categoryList) => {
    if (Array.isArray(categoryList)) {
      categoryList.forEach((product) => {
        if (product.stock !== false && product.available !== false && checkIsPromoActive(product)) {
          activePromos.push(product);
        }
      });
    }
  });

  // Si no hay ninguna promoción activa en este momento, no renderizamos la sección
  if (activePromos.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, activePromos.length - 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = startX.current - e.clientX;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  return (
    <section className="promo-carousel-container">
      {/* Encabezado / Divisor temático */}
      <div className="promo-header-divider">
        <h3>🔥 PROMOCIONES ESPECIALES 🔥</h3>
      </div>

      <div className="promo-carousel-wrapper">
        <div className="promo-carousel-counter">
          {currentIndex + 1} / {activePromos.length}
        </div>

        <div
          className="promo-carousel-track"
          ref={trackRef}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {activePromos.map((product) => (
            <PromoCardItem key={product.id || product.productTitle} product={product} />
          ))}
        </div>

        {/* Botones de navegación */}
        {currentIndex > 0 && (
          <button className="promo-nav-btn prev-btn" onClick={prevSlide} aria-label="Anterior">
            ❮
          </button>
        )}

        {currentIndex < activePromos.length - 1 && (
          <button className="promo-nav-btn next-btn" onClick={nextSlide} aria-label="Siguiente">
            ❯
          </button>
        )}
      </div>
    </section>
  );
};

export default PromoCarousel;