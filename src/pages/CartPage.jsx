import React, { useState } from 'react';
import { IoLogoWhatsapp } from 'react-icons/io';
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

  // Estado del selector de entrega y formulario
  const [tipoEntrega, setTipoEntrega] = useState('domicilio');
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [notasPedido, setNotasPedido] = useState('');

  // Estado del método de pago
  const [metodoPago, setMetodoPago] = useState('nequi'); // 'nequi' | 'efectivo'
  const [conCuantoPaga, setConCuantoPaga] = useState('');

  const esDomicilio = tipoEntrega === 'domicilio';

  const enviarAWhatsapp = () => {
    const productosConStock = carrito.filter((item) => item.isStock);

    if (productosConStock.length === 0) {
      alert("No hay productos disponibles en tu carrito para enviar la orden.");
      return;
    }

    // Validaciones del formulario cuando es domicilio
    if (esDomicilio) {
      if (!nombre.trim()) {
        alert("Por favor ingresa tu nombre.");
        return;
      }
      if (!direccion.trim()) {
        alert("Por favor ingresa la dirección de entrega.");
        return;
      }
    }

    let mensaje = "";

    if (!isOpen && scheduledHeader) {
      mensaje += `${scheduledHeader}\n\n`;
    }

    mensaje += `${textWhatsappHeader}\n\n`;

    // Tipo de entrega
    mensaje += esDomicilio ? `🚚 *Tipo de entrega:* Domicilio\n` : `🏪 *Tipo de entrega:* Recoger en tienda\n`;

    // Datos del cliente (solo domicilio)
    if (esDomicilio) {
      mensaje += `👤 *Nombre:* ${nombre.trim()}\n`;
      mensaje += `📍 *Dirección:* ${direccion.trim()}\n`;
      if (notasPedido.trim()) {
        mensaje += `📝 *Notas:* ${notasPedido.trim()}\n`;
      }
    }

    // Método de pago
    if (metodoPago === 'nequi') {
      mensaje += `💳 *Método de pago:* Nequi / Llave Bre-B\n`;
    } else {
      mensaje += `💵 *Método de pago:* Efectivo`;
      if (conCuantoPaga.trim()) {
        mensaje += ` (Paga con: ${conCuantoPaga.trim()})`;
      }
      mensaje += `\n`;
    }

    mensaje += `\n`;

    productosConStock.forEach((item) => {
      const nombreProducto = item.productTitle || item.title;
      mensaje += `✅ ${item.cantidad}x ${nombreProducto} $ ${item.subtotal.toLocaleString('es-CO')}\n`;
      
      if (item.observacion && item.observacion.trim() !== '') {
        mensaje += `   ✍️ _Nota: ${item.observacion.trim()}_\n`;
      }
    });

    mensaje += `\n💰 *Subtotal productos:* $${totalPagar.toLocaleString('es-CO')}`;
    if (esDomicilio) {
      mensaje += `\n🚚 *Domicilio:* Por acordar según ubicación`;
    }
    mensaje += `\n💰 *Total a pagar: $${totalPagar.toLocaleString('es-CO')}* ${esDomicilio ? '+ domicilio' : ''}`;
    mensaje += `\n\n${textWhatsappFooter}`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="kart-mainContainer">
      <div className="kart-header">
        <BackTo />        
        <h2>Tu Pedido ({totalItems})</h2>
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

          {/* ===== Selector de tipo de entrega ===== */}
          <div className="delivery-selector">
            <div className="delivery-toggle">
              <button 
                className={`delivery-toggle-btn ${esDomicilio ? 'active' : ''}`}
                onClick={() => setTipoEntrega('domicilio')}
              >
                Domicilio
              </button>
              <button 
                className={`delivery-toggle-btn ${!esDomicilio ? 'active' : ''}`}
                onClick={() => setTipoEntrega('recoger')}
              >
                Recoger
              </button>
            </div>

            {/* Formulario de datos — solo visible en Domicilio */}
            {esDomicilio && (
              <div className="delivery-form">
                <div className="delivery-field">
                  <label className="delivery-label">Nombre</label>
                  <input
                    type="text"
                    className="delivery-input"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    maxLength={60}
                  />
                </div>
                <div className="delivery-field">
                  <label className="delivery-label">Dirección de entrega</label>
                  <input
                    type="text"
                    className="delivery-input"
                    placeholder="Calle, número, barrio"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    maxLength={120}
                  />
                </div>
                <div className="delivery-field">
                  <label className="delivery-label">Notas (opcional)</label>
                  <input
                    type="text"
                    className="delivery-input"
                    placeholder="Sin cebolla, salsa aparte..."
                    value={notasPedido}
                    onChange={(e) => setNotasPedido(e.target.value)}
                    maxLength={150}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ===== Selector de método de pago ===== */}
          <div className="payment-selector">
            <label className="delivery-label">Método de pago</label>
            <div className="payment-toggle">
              <button 
                type="button"
                className={`payment-toggle-btn ${metodoPago === 'nequi' ? 'active' : ''}`}
                onClick={() => setMetodoPago('nequi')}
              >
                📱 Nequi / Bre-B
              </button>
              <button 
                type="button"
                className={`payment-toggle-btn ${metodoPago === 'efectivo' ? 'active' : ''}`}
                onClick={() => setMetodoPago('efectivo')}
              >
                💵 Efectivo
              </button>
            </div>

            {metodoPago === 'efectivo' ? (
              <div className="payment-cash-field">
                <input
                  type="text"
                  className="delivery-input"
                  placeholder="¿Con cuánto pagas? (ej: $50.000 o exacto)"
                  value={conCuantoPaga}
                  onChange={(e) => setConCuantoPaga(e.target.value)}
                  maxLength={40}
                />
                <p className="payment-note">ℹ️ Pagas contra entrega al recibir tu pedido.</p>
              </div>
            ) : (
              <p className="payment-note">ℹ️ Te enviaremos el número o QR por WhatsApp para realizar la transferencia.</p>
            )}
          </div>

          {/* ===== Resumen del pedido ===== */}
          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totalPagar.toLocaleString('es-CO')}</span>
            </div>
            {esDomicilio && (
              <>
                <div className="summary-row">
                  <span>Domicilio</span>
                  <span className="summary-por-acordar">Por acordar</span>
                </div>
                <p className="delivery-note">El costo del envío se confirma por WhatsApp según tu ubicación</p>
              </>
            )}
            <div className="summary-row summary-total">
              <span>Total</span>
              <span className="summary-total-price">${totalPagar.toLocaleString('es-CO')}{esDomicilio ? ' + envío' : ''}</span>
            </div>
          </div>
        </div>
      )}

      {carrito.length > 0 && (
        <div className="kart-footer">       
          <button 
            className={`btn-checkout ${isOpen ? 'btn-open' : 'btn-closed'}`} 
            onClick={enviarAWhatsapp}
          >
            <IoLogoWhatsapp size={22} /> {isOpen ? 'Enviar pedido por WhatsApp' : textBtnClosed}
          </button>
        </div>
      )}
    </div>  
  );
};
