import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './imageCarouselManual-styles.css'

const ImageCarouselManual = ({ dataKey }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const trackRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex(0);
  }, [dataKey]);

  const productsData = t(dataKey, { returnObjects: true }) || [];
  const [product, ...itemList] = productsData;
  const carouselTitle = product?.mainTitle;
  //const imageSrc = headerInfo?.image;  
  
  console.log('carouselTitle:', carouselTitle );

  if (!productsData.length) {
    return (
      <section className="manual-carousel-section">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No hay datos para "{dataKey}"
        </div>
      </section>
    );
  }

 const nextSlide = () => {
  setCurrentIndex((prev) => Math.min(prev + 1, itemList.length - 1));
};

const prevSlide = () => {
  setCurrentIndex((prev) => Math.max(prev - 1, 0));
};

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };


  const handleTouchEnd = (e) => {
    //esta funcion se ejecuta cuando el usuario deja de tocar el carrusel
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

  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) > 20) {
      if (e.deltaX > 0) nextSlide();
      else prevSlide();
    }
  };

  return (
    <section className="manual-carousel-section">
      <div className="carousel-wrapper">

        <h2 className="carousel-title" style={{ backgroundColor: '#222B2E' }}>{carouselTitle}</h2>
        
        {/* ✅ CONTADOR "1 de X" AGREGADO AQUÍ */}
        <div className="carousel-counter">
          {currentIndex + 1} / {productsData.length-1}
        </div>

        <div 
          className="carousel-track" 
          ref={trackRef}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
        >
         {itemList.map((product, index) => (
  <div key={product.id || index} className="card-slide">
    <div className="card-inner">
      <div className="card-image" role="button" tabIndex={0}>
        <img
          src={`${import.meta.env.BASE_URL}${product.image}`}
          alt={product.title}
          loading="lazy"
        />
      </div>

      <div className="card-content">
        <h3>{product.title}</h3>
        <p>{product.ingredient1}</p>
        <div className="price">
          <h1>{product.price}</h1>
        </div>
      </div>
    </div>
  </div>
))}
        </div>

        {/* ✅ BOTONES SE OCULTAN SI ESTÁN EN LOS EXTREMOS */}
        {currentIndex > 0 && (
          <button className="nav-btn prev-btn" onClick={prevSlide}>❮</button>
        )}
        
        {currentIndex < productsData.length - 1 && (
          <button className="nav-btn next-btn" onClick={nextSlide}>❯</button>
        )}
      </div>

     {/*} <div className="dots-container">
        {productsData.map((_, index) => (
          <button
            key={`dot-${index}`}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>*/}
    </section>
  );
};

export default ImageCarouselManual;