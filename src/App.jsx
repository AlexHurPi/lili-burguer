import './App.css';
import './languages/i18n.js';
import { useTranslation } from 'react-i18next';
import Header from './components/header-components/Header';
import Footer from './components/footer-components/Footer.jsx';
import { Routes, Route, useLocation } from 'react-router-dom'; // 👈 Importamos useLocation
import Inicio from './pages/Inicio';
import { CartPage } from './pages/CartPage'; 
import { ProductDetails } from './pages/ProductDetails';
import ScrollToTop from './components/scrollToTop-component/ScrollToTop';
import { CartProvider } from './context/CartContext.jsx';
import { MenuProvider } from './context/MenuContext';
import Admin from './pages/Admin';

function App() {
  const { t } = useTranslation();
  const location = useLocation(); // 👈 Obtenemos la ruta actual

  // Verificamos si la ruta actual es exactamente la del panel de administración
  const isAdminRoute = location.pathname.toLowerCase() === '/admin' || location.pathname.toLowerCase() === '/admin/';

  return (
    <>
    <MenuProvider>
      {/* 👈 Renderizado condicional: El Header público NO se muestra en /admin */}
      {!isAdminRoute && <Header/>}
      
      <ScrollToTop />      
      <CartProvider>
      <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/inicio" element={<Inicio />} />      
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/ProductDetails" element={<ProductDetails />} />
          <Route path="/admin" element={<Admin />} />
      </Routes>   
      </CartProvider>   
    </MenuProvider>
    </>
  )
}

export default App;