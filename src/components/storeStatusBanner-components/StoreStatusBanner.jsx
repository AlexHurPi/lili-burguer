import React, { useState, useEffect } from 'react';
import { getStoreStatus } from '../../helpers/storeHelper';
import { useMenu } from '../../context/MenuContext'; // 👈 Importamos el Contexto de Firestore
import './storeStatusBanner-styles.css';

export const StoreStatusBanner = () => {
  const { menuData } = useMenu(); // 👈 Obtenemos los datos en vivo de la BD

  const [status, setStatus] = useState(() => 
    getStoreStatus(menuData?.storeStatus)
  );

  // Recalcula el estado cada vez que Firestore cambia o transcurre 1 minuto
  useEffect(() => {
    const updateStatus = () => {
      setStatus(getStoreStatus(menuData?.storeStatus));
    };

    updateStatus(); // Actualización inmediata al recibir cambios de Firestore

    const interval = setInterval(updateStatus, 60000); // Chequeo por hora del reloj
    return () => clearInterval(interval);
  }, [menuData]);

  const { isOpen, bannerMessage } = status;

  return (
    <div className={`store-status-banner ${isOpen ? 'status-open' : 'status-closed'}`}>
      <div className="status-indicator-dot"></div>
      <span className="status-message-text">{bannerMessage}</span>
    </div>
  );
};

export default StoreStatusBanner;