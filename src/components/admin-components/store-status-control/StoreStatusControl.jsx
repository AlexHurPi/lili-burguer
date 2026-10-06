import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useMenu } from '../../../context/MenuContext';
import './storeStatusControl.css';
import StoreScheduleControl from './StoreScheduleControl'; // Importamos el subcomponente de Horario Semanal

const StoreStatusControl = () => {
  const { menuData } = useMenu();
  const [saving, setSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });
  // En el objeto de estado inicial dentro de StoreStatusControl.jsx:
  const [whatsappNumber, setWhatsappNumber] = useState('573228737508');

  // Estados locales para el formulario
  const [manualOverride, setManualOverride] = useState('none');
  const [messages, setMessages] = useState({
    openBanner: '',
    closedBanner: '',
    closedCartNotice: '',
    scheduledOrderHeader: ''
  });
  // 1. Mensajes por defecto para evitar que los campos queden vacíos
const DEFAULT_MESSAGES = {
  openBanner: '🟢 ¡Estamos Abiertos! Toma tu pedido ahora',
  closedBanner: '🔴 Tienda Cerrada • Abrimos a las 4:00 PM',
  closedCartNotice: 'En este momento la cocina está cerrada. Tu pedido se registrará como PROGRAMADO para ser despachado cuando abramos.',
  scheduledOrderHeader: '📌 *PEDIDO PROGRAMADO* (Para entregar en el próximo horario de atención)',
  whatsappHeader: '📋 *¡Hola! Quiero hacer el siguiente pedido:*',
  whatsappFooter: '¡Quedo atento para coordinar el pago y el envío!',
  deliveryNotice: '¡Domicilios cercanos son gratis!',
  whatsappInfoNotice: 'Haciendo clic en el botón de abajo, podrás enviar tu pedido por WhatsApp, allí te enviamos información para coordinar el pago y el envío.',
  checkoutBtnOpen: 'HAZ TU PEDIDO',
  checkoutBtnClosed: '📌 PROGRAMAR PEDIDO POR WHATSAPP',
  outOfStockNotice: '⚠️ Producto agotado por el momento. No se incluirá en la orden.',
  notePlaceholder: 'Sugerencia (ej: sin cebolla, salsa aparte...)'
};

  // Cargar datos actuales desde MenuContext cuando estén disponibles
      useEffect(() => {
      if (menuData?.storeStatus) {
        const storeMsgs = menuData.storeStatus.messages || {};

        setManualOverride(menuData.storeStatus.manualOverride || 'none');
        setWhatsappNumber(menuData.storeStatus.whatsappNumber || '573228737508');

        setMessages({
          openBanner: storeMsgs.openBanner || DEFAULT_MESSAGES.openBanner,
          closedBanner: storeMsgs.closedBanner || DEFAULT_MESSAGES.closedBanner,
          closedCartNotice: storeMsgs.closedCartNotice || DEFAULT_MESSAGES.closedCartNotice,
          scheduledOrderHeader: storeMsgs.scheduledOrderHeader || DEFAULT_MESSAGES.scheduledOrderHeader,
          whatsappHeader: storeMsgs.whatsappHeader || DEFAULT_MESSAGES.whatsappHeader,
          whatsappFooter: storeMsgs.whatsappFooter || DEFAULT_MESSAGES.whatsappFooter,
          deliveryNotice: storeMsgs.deliveryNotice || DEFAULT_MESSAGES.deliveryNotice,
          whatsappInfoNotice: storeMsgs.whatsappInfoNotice || DEFAULT_MESSAGES.whatsappInfoNotice,
          checkoutBtnOpen: storeMsgs.checkoutBtnOpen || DEFAULT_MESSAGES.checkoutBtnOpen,
          checkoutBtnClosed: storeMsgs.checkoutBtnClosed || DEFAULT_MESSAGES.checkoutBtnClosed,
          outOfStockNotice: storeMsgs.outOfStockNotice || DEFAULT_MESSAGES.outOfStockNotice,
          notePlaceholder: storeMsgs.notePlaceholder || DEFAULT_MESSAGES.notePlaceholder
        });
      }
    }, [menuData]);

  // Guardar cambios en Firestore
  const handleSaveStatus = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedbackMsg({ type: '', text: '' });

    try {
      // Documento 'spanish' en la colección 'menu'
      const docRef = doc(db, 'menu', 'spanish');

      // Dentro de handleSaveStatus (al guardar en Firestore):
      await updateDoc(docRef, {
        'storeStatus.whatsappNumber': whatsappNumber,
        'storeStatus.manualOverride': manualOverride,
        'storeStatus.messages.openBanner': messages.openBanner,
        'storeStatus.messages.closedBanner': messages.closedBanner,
        'storeStatus.messages.closedCartNotice': messages.closedCartNotice,
        'storeStatus.messages.scheduledOrderHeader': messages.scheduledOrderHeader,
        'storeStatus.messages.whatsappHeader': messages.whatsappHeader,
        'storeStatus.messages.whatsappFooter': messages.whatsappFooter,
        'storeStatus.messages.deliveryNotice': messages.deliveryNotice,
        'storeStatus.messages.whatsappInfoNotice': messages.whatsappInfoNotice,
        'storeStatus.messages.checkoutBtnOpen': messages.checkoutBtnOpen,
        'storeStatus.messages.checkoutBtnClosed': messages.checkoutBtnClosed
      });

      setFeedbackMsg({
        type: 'success',
        text: '¡Estado de la tienda actualizado en tiempo real!'
      });
    } catch (error) {
      console.error('Error al actualizar Firestore:', error);
      setFeedbackMsg({
        type: 'error',
        text: 'Error al guardar los cambios. Intenta de nuevo.'
      });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 4000);
    }
  };

  return (
    <div className="store-control-card">
      <div className="store-control-header">
        <h2>🕒 Control Operativo de la Tienda</h2>
        <p>Ajusta la disponibilidad y los mensajes de aviso para tus clientes.</p>
      </div>

      {feedbackMsg.text && (
        <div className={`status-alert-banner ${feedbackMsg.type}`}>
          {feedbackMsg.text}
        </div>
      )}

      <form onSubmit={handleSaveStatus} className="store-control-form">
        {/* SECCIÓN 1: MODO DE OPERACIÓN */}
        <div className="control-section">
          <label className="section-title">Modo de Operación</label>
          <div className="override-options-grid">
            <button
              type="button"
              className={`override-btn auto ${manualOverride === 'none' ? 'selected' : ''}`}
              onClick={() => setManualOverride('none')}
            >
              <span className="btn-icon">⏰</span>
              <div className="btn-text">
                <strong>AUTOMÁTICO</strong>
                <small>Según horario semanal</small>
              </div>
            </button>

            <button
              type="button"
              className={`override-btn force-open ${manualOverride === 'force_open' ? 'selected' : ''}`}
              onClick={() => setManualOverride('force_open')}
            >
              <span className="btn-icon">🟢</span>
              <div className="btn-text">
                <strong>FORZAR ABIERTO</strong>
                <small>Abrir fuera de horario</small>
              </div>
            </button>

            <button
              type="button"
              className={`override-btn force-closed ${manualOverride === 'force_closed' ? 'selected' : ''}`}
              onClick={() => setManualOverride('force_closed')}
            >
              <span className="btn-icon">🔴</span>
              <div className="btn-text">
                <strong>FORZAR CERRADO</strong>
                <small>Cierre de emergencia</small>
              </div>
            </button>
          </div>
        </div>

        {/* 📅 SUBCOMPONENTE: Configuración de Horario Semanal */}
        <StoreScheduleControl />
        
        {/* SECCIÓN 2: MENSAJES Y CONTACTO EDITABLES (DESPLEGABLE) */}
        <div className="control-section">
          <details className="admin-collapsible-section">
            <summary className="section-title collapsible-title">
              💬 Mensajes de la Aplicación y Contacto <span>(Toca para abrir/cerrar)</span>
            </summary>

            <div className="collapsible-content">
              {/* Teléfono de WhatsApp */}
              <div className="form-group-admin">
                <label htmlFor="whatsappNumber">📱 Número de WhatsApp (Receptor de pedidos):</label>
                <input
                  id="whatsappNumber"
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Ej: 573228737508"
                />
              </div>

              <hr className="admin-divider" />

              {/* Banners Principales */}
              <div className="form-group-admin">
                <label htmlFor="openBanner">Banner cuando está Abierto:</label>
                <input
                  id="openBanner"
                  type="text"
                  value={messages.openBanner || ''}
                  onChange={(e) => setMessages({ ...messages, openBanner: e.target.value })}
                  placeholder="Ej: 🟢 ¡Estamos Abiertos! Toma tu pedido ahora"
                />
              </div>

              <div className="form-group-admin">
                <label htmlFor="closedBanner">Banner cuando está Cerrado:</label>
                <input
                  id="closedBanner"
                  type="text"
                  value={messages.closedBanner || ''}
                  onChange={(e) => setMessages({ ...messages, closedBanner: e.target.value })}
                  placeholder="Ej: 🔴 Tienda Cerrada • Abrimos a las 4:00 PM"
                />
              </div>

              <div className="form-group-admin">
                <label htmlFor="closedCartNotice">Aviso en Carrito cuando está Cerrado:</label>
                <textarea
                  id="closedCartNotice"
                  rows="2"
                  value={messages.closedCartNotice || ''}
                  onChange={(e) => setMessages({ ...messages, closedCartNotice: e.target.value })}
                  placeholder="Aviso explicativo para el cliente en el carrito..."
                />
              </div>

              <hr className="admin-divider" />

              {/* Textos del Carrito y Botones */}
              <div className="form-group-admin">
                <label htmlFor="deliveryNotice">Aviso de Domicilio en Carrito:</label>
                <input
                  id="deliveryNotice"
                  type="text"
                  value={messages.deliveryNotice || ''}
                  onChange={(e) => setMessages({ ...messages, deliveryNotice: e.target.value })}
                  placeholder="Ej: ¡Domicilios cercanos son gratis!"
                />
              </div>

              <div className="form-group-admin">
                <label htmlFor="whatsappInfoNotice">Explicación antes del botón de pedido:</label>
                <textarea
                  id="whatsappInfoNotice"
                  rows="2"
                  value={messages.whatsappInfoNotice || ''}
                  onChange={(e) => setMessages({ ...messages, whatsappInfoNotice: e.target.value })}
                  placeholder="Texto instructivo sobre pago y envío..."
                />
              </div>

              <div className="form-group-admin">
                <label htmlFor="checkoutBtnOpen">Texto del Botón (Tienda Abierta):</label>
                <input
                  id="checkoutBtnOpen"
                  type="text"
                  value={messages.checkoutBtnOpen || ''}
                  onChange={(e) => setMessages({ ...messages, checkoutBtnOpen: e.target.value })}
                  placeholder="Ej: HAZ TU PEDIDO"
                />
              </div>

              <div className="form-group-admin">
                <label htmlFor="checkoutBtnClosed">Texto del Botón (Tienda Cerrada):</label>
                <input
                  id="checkoutBtnClosed"
                  type="text"
                  value={messages.checkoutBtnClosed || ''}
                  onChange={(e) => setMessages({ ...messages, checkoutBtnClosed: e.target.value })}
                  placeholder="Ej: 📌 PROGRAMAR PEDIDO POR WHATSAPP"
                />
              </div>

              <div className="form-group-admin">
                <label htmlFor="outOfStockNotice">Aviso para Productos Agotados:</label>
                <input
                  id="outOfStockNotice"
                  type="text"
                  value={messages.outOfStockNotice || ''}
                  onChange={(e) => setMessages({ ...messages, outOfStockNotice: e.target.value })}
                  placeholder="Ej: ⚠️ Producto agotado por el momento."
                />
              </div>

              <div className="form-group-admin">
                <label htmlFor="notePlaceholder">Placeholder de sugerencias en producto:</label>
                <input
                  id="notePlaceholder"
                  type="text"
                  value={messages.notePlaceholder || ''}
                  onChange={(e) => setMessages({ ...messages, notePlaceholder: e.target.value })}
                  placeholder="Ej: Sugerencia (ej: sin cebolla, salsa aparte...)"
                />
              </div>

              <hr className="admin-divider" />

              {/* Formato de Mensaje de WhatsApp */}
              <div className="form-group-admin">
                <label htmlFor="scheduledOrderHeader">Encabezado para Pedido Programado (WhatsApp):</label>
                <input
                  id="scheduledOrderHeader"
                  type="text"
                  value={messages.scheduledOrderHeader || ''}
                  onChange={(e) => setMessages({ ...messages, scheduledOrderHeader: e.target.value })}
                  placeholder="Ej: 📌 *PEDIDO PROGRAMADO*"
                />
              </div>

              <div className="form-group-admin">
                <label htmlFor="whatsappHeader">Saludo inicial de la orden (WhatsApp):</label>
                <input
                  id="whatsappHeader"
                  type="text"
                  value={messages.whatsappHeader || ''}
                  onChange={(e) => setMessages({ ...messages, whatsappHeader: e.target.value })}
                  placeholder="Ej: 📋 *¡Hola! Quiero hacer el siguiente pedido:*"
                />
              </div>

              <div className="form-group-admin">
                <label htmlFor="whatsappFooter">Mensaje de cierre de la orden (WhatsApp):</label>
                <input
                  id="whatsappFooter"
                  type="text"
                  value={messages.whatsappFooter || ''}
                  onChange={(e) => setMessages({ ...messages, whatsappFooter: e.target.value })}
                  placeholder="Ej: ¡Quedo atento para coordinar el pago y el envío!"
                />
              </div>
            </div>
          </details>
        </div>

        {/* BOTÓN DE GUARDAR */}
        <button type="submit" className="btn-save-store-status" disabled={saving}>
          {saving ? 'Guardando en Firestore...' : '💾 GUARDAR CAMBIOS'}
        </button>
      </form>
    </div>
  );
};

export default StoreStatusControl;