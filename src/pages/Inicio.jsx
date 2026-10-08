//*Este es el componente Inicio, donde se muestran todas las tarjetas de productos.
//*Se itera sobre el array de productos para renderizar cada una de ellas.
//*Cada tarjeta tiene un enlace a la pantalla de detalles del producto.
//*Para aumentar los productos en la pantalla de inicio se puede cambiar el lenght de totalTarjetas por 13, 14 15 o los que se deseeen agregar
//*const totalTarjetas = Array.from({ length: 12 }, (_, index) => index + 1); 
//*la etiqueta link tiene un estado el cual contienme la informacion de la tarjeta que se va a mostrar en la pantalla de detalles

import React from 'react';
import ImageCard2 from '../components/image-card2/ImageCard2';
import ImageCarouselManual from '../components/imageCarousel-components/ImageCarouselManual';
import { WhatsappButton } from "../components/whatsapp-components/WhatsappButton";
import { Kart } from '../components/kart-components/Kart';
import { Footer } from '../components/footer-components/Footer';
import PromoCarousel from '../components/promoCarousel/PromoCarousel';
import StoreStatusBanner from '../components/storeStatusBanner-components/StoreStatusBanner';
import { useMenu } from '../context/MenuContext';
import { migrarMenuAFirestore } from '../helpers/migrador';


const Inicio = () => {
  const { menuData } = useMenu();

  /*// Extrae las claves y las ordena estrictamente por su valor numérico (card1, card2... card10, card15)
  const categoryKeys = Object.keys(menuData?.cards || {}).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });*/

  // Ordena las categorías según la secuencia definida en categoryOrder de Firestore
  const categoryKeys = Object.keys(menuData?.cards || {}).sort((a, b) => {
    const orderList = menuData?.categoryOrder || [];
    const indexA = orderList.indexOf(a);
    const indexB = orderList.indexOf(b);

    // Si ambas llaves están en la lista global, respeta su posición
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // Fallback numérico en caso de que la clave no esté registrada en la lista
    const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  return (
    <div className="inicio-mainContainer">
      {/* Banner del Estado de la Tienda */}
      <StoreStatusBanner />

      {/* 🔥 CARRUSEL DE PROMOCIONES VIGENTES 🔥 */}
      <PromoCarousel totalCards={categoryKeys.length || 15} />

      {/* Iteración ordenada numéricamente */}
      {categoryKeys.map((key) => (
        <div key={key} className="card">
          <ImageCard2 dataKey={`cards.${key}`} />          
        </div>
      ))}
      
      <WhatsappButton />
      <Kart />
      <button onClick={migrarMenuAFirestore} style={{ padding: '12px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', margin: '20px' }}>
      🚀 Subir spanish.json a Firebase
      </button>

      <Footer dataKey="footer" />
    </div>
  );
};

export default Inicio;