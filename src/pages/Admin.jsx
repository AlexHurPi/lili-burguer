import React, { useState, useEffect, useRef } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '../services/firebase';
import AdminLogin from '../components/admin-components/admin-login/AdminLogin';
import './admin.css';
import StoreStatusControl from '../components/admin-components/store-status-control/StoreStatusControl';
import InventoryControl from '../components/admin-components/inventory-control/InventoryControl';
import HeaderFooterControl from '../components/admin-components/header-footer-control/HeaderFooterControl';
import ProductCatalogControl from '../components/admin-components/product-catalog-control/ProductCatalogControl';


const auth = getFirebaseAuth();

const Admin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('store-status'); // Pestaña activa inicial
  const navRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🎯 Función para cambiar de pestaña y autocentrarla en la barra horizontal
  const handleTabClick = (e, tabKey) => {
    setActiveTab(tabKey);

    // Hace que el botón presionado se desplace al centro visible suavemente
    e.currentTarget.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="spinner"></div>
        <p>Cargando panel...</p>
      </div>
    );
  }

  // SI NO HAY SESIÓN: Muestra el componente refactorizado
  if (!user) {
    return <AdminLogin />;
  }

  // SI HAY SESIÓN: Muestra el Dashboard con navegación por pestañas
  return (
    <div className="admin-dashboard-container">
      <header className="admin-navbar">
        <div className="admin-navbar-info">
          <h1>🍔 Lili-Hamburger Admin</h1>
          <span className="admin-user-email">👤 {user.email}</span>
        </div>
        <button onClick={handleLogout} className="admin-btn-logout">
          🚪 Cerrar Sesión
        </button>
      </header>

      {/* Menú de Pestañas Móviles */}
      <div className="admin-container">
          {/* Navegación por pestañas */}
          <nav className="admin-tab-nav">
            <button
              className={`tab-btn ${activeTab === 'store-status' ? 'active' : ''}`}
              onClick={(e) => handleTabClick(e, 'store-status')}
            >
              ⏰ Horario & Estado
            </button>

            <button
              className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={(e) => handleTabClick(e, 'inventory')}
            >
              📦 Stock & Precios
            </button>

            <button
              className={`tab-btn ${activeTab === 'brand-info' ? 'active' : ''}`}
              onClick={(e) => handleTabClick(e, 'brand-info')}
            >
              🎨 Identidad & Marca
            </button>

            <button
              className={`tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
              onClick={(e) => handleTabClick(e, 'catalog')}
            >
              ➕ Catálogo & Crear
            </button>
          </nav>

          {/* ÁREA DE CONTENIDO MODULAR: Contenido principal de la pestaña activa */}
          <main className="admin-content-wrapper">
            {activeTab === 'store-status' && <StoreStatusControl />}
            {activeTab === 'inventory' && <InventoryControl />}
            {activeTab === 'brand-info' && <HeaderFooterControl />}
            {activeTab === 'catalog' && <ProductCatalogControl />}
          </main>
      </div>
      
    </div>
  );
};

export default Admin;