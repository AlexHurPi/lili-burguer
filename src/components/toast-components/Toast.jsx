/** ========================================================================
 * @file Toast.jsx
 * @description Componente Toast para mostrar notificaciones en la interfaz de usuario. 
 ** ========================================================================*/

import React, { useEffect } from 'react';
import './toast.css';

export const Toast = ({ show, message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className={`toast-notification ${type}`}>
      <span className="toast-icon">
        {type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️'}
      </span>
      <span className="toast-message">{message}</span>
    </div>
  );
};

export default Toast;