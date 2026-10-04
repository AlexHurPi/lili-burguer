import React from 'react';
import { BackTo } from '../components/backTo-components/BackTo.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useMenu } from '../context/MenuContext.jsx';
import { getStoreStatus } from '../helpers/storeHelper.js';
import './cartPage.css';

export const CartPage = () => {
  const { 
    carrito, 
    totalItems, 
    totalPagar, 
    incrementar, 
    decrementar, 
    eliminar, 
    actualizarObservacion 
  } = useCart();

  const { menuData } = useMenu();
  const storeStatusConfig = menuData?.storeStatus;

  const { isOpen, closedNotice, scheduledHeader } = getStoreStatus(storeStatusConfig);

  const whatsappNumber = storeStatusConfig?.whatsappNumber || "573228737508";
  const messages = storeStatusConfig?.messages || {};

  const textWhatsappHeader = messages.whatsappHeader || "📋 *¡Hola! Quiero hacer el siguiente pedido:*";
  const textWhatsappFooter = messages.whatsappFooter || "¡Quedo atento para coordinar el pago y el envío!";
  const textDeliveryNotice = messages.deliveryNotice || "¡Domicilios cercanos son gratis!";
  const textWhatsappInfo = messages.whatsappInfoNotice || "Haciendo clic en el botón de abajo, podrás enviar tu pedido por WhatsApp, allí te enviamos información para coordinar el pago y el envío.";
  const textBtnOpen = messages.checkoutBtnOpen || "HAZ TU PEDIDO";
  const textBtnClosed = messages.checkoutBtnClosed || "📌 PROGRAMAR PEDIDO POR WHATSAPP";
  const textOutOfStock = messages.outOfStockNotice || "⚠️ Producto agotado por el momento. No se incluirá en la orden.";
  const textNotePlaceholder = messages.notePlaceholder || "Sugerencia (ej: sin cebolla, salsa aparte...)";

  const enviarAWhatsapp = () => {
    const productosConStock = carrito.filter((item) => item.isStock);

    if (productosConStock.length === 0) {
      alert("No hay productos disponibles en tu carrito para enviar la orden.");
      return;
    }

    let mensaje = "";

    if (!isOpen && scheduledHeader) {
      mensaje += `${scheduledHeader}\n\n`;
    }

    mensaje += `${textWhatsappHeader}\n\n`;

    productosConStock.forEach((item) => {
      const nombreProducto = item.productTitle || item.title;
      mensaje += `✅ ${item.cantidad}x ${nombreProducto} $ ${item.subtotal.toLocaleString('es-CO')}\n`;
      
      if (item.observacion && item.observacion.trim() !== '') {
        mensaje += `   ✍️ _Nota: ${item.observacion.trim()}_\n`;
      }
    });

    mensaje += `\n💰 *Total a pagar: $${totalPagar.toLocaleString('es-CO')}*`;
    mensaje += `\n\n${textWhatsappFooter}`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="kart-mainContainer">
      <div className="kart-header">
        <BackTo />        
        <h2>Tu Carrito ({totalItems})</h2>
      </div>

      {!isOpen && (
        <div className="store-closed-cart-alert">
          <p>{closedNotice}</p>
        </div>
      )}
        
      {carrito.length === 0 ? (
        <div className="kart-empty">
          <p>Tu carrito está vacío.</p>
          <span>¡Agrega algo delicioso!</span>
        </div>
      ) : (
        <div className="kart-items-container">
          {carrito.map((item) => {
            const categoryName = item.categoryTitle || item.mainTitle;
            const productName = item.productTitle || item.title;
            
            // Evaluación defensiva para evitar 'undefined' en la UI
            const precioMostrar = item.price || (item.isPromo ? item.offerPrice : item.regularPrice) || '0';

            return (
              <div 
                className={`kart-item ${!item.isStock ? 'kart-item-disabled' : ''}`} 
                key={item.id}
              >
                <div className="kart-item-image">
                  <img src={item.image} alt={productName} />
                </div>
                <div className="kart-item-info">
                  {categoryName && <h3>{categoryName}</h3>}
                  <h4>{productName}</h4>                
                  
                  <p className="kart-item-price">
                    {precioMostrar.includes('$') ? precioMostrar : `$${precioMostrar}`}
                  </p>

                  {!item.isStock && (
                    <p className="out-of-stock-cart-text">
                      {textOutOfStock}
                    </p>
                  )}

                  <input
                    type="text"
                    className="kart-item-note-input"
                    placeholder={textNotePlaceholder}
                    value={item.observacion || ''}
                    onChange={(e) => actualizarObservacion(item.id, e.target.value)}
                    maxLength={100}
                    disabled={!item.isStock}
                  />

                  <div className="kart-item-controls">
                    <div className="custom-qty-controls">
                      <button 
                        className="qty-btn minus" 
                        onClick={() => decrementar(item.id)}
                      >
                        -
                      </button>
                      <span className="qty-number">{item.cantidad}</span>
                      <button 
                        className="qty-btn plus" 
                        onClick={() => incrementar(item.id)}
                        disabled={!item.isStock}
                      >
                        +
                      </button>
                    </div>
                    <button className="btn-delete" onClick={() => eliminar(item.id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {carrito.length > 0 && (
        <div className="kart-footer">
          <div className="kart-total-row">
            <span>Total a pagar:</span>
            <span className="kart-total-price">${totalPagar.toLocaleString('es-CO')}</span>         
          </div>          
          <h4>{textDeliveryNotice}</h4> 
          <h6>{textWhatsappInfo}</h6>        
          <button 
            className={`btn-checkout ${isOpen ? 'btn-open' : 'btn-closed'}`} 
            onClick={enviarAWhatsapp}
          >
            {isOpen ? textBtnOpen : textBtnClosed}
          </button>
        </div>
      )}
    </div>  
  );
};