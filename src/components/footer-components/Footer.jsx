import React from "react";
import "./footer.css";
import Redes from "../redes-sociales/Redes";
import { useMenu } from '../../context/MenuContext';

export const Footer = () => {
  const year = new Date().getFullYear();  
  const { menuData } = useMenu();

  const footerInfo = menuData?.footer || {};
  const {
    empresa = 'Lili-Hamburger',
    slogan = 'Tu antojo, al instante',
    razonsocial = '',
    nit = '',
    dondeestamos = '¿Dónde estamos?',
    ubicacion = 'Somos una tienda virtual ubicada en el norte de Cali - Valle del Cauca.',
    direccion = '',
    correo = '',
    telefono = '+57 3228737508',
    redessociales = 'Síguenos en nuestras redes sociales:',
    facebook = '',
    instagram = '',
    tiktok = '',
    twitter = '',
    youtube = '',
    final = 'Lili-Hamburger.'
  } = footerInfo;

  // Limpiamos el teléfono para el enlace tel: (solo números y +)
  const telClean = telefono.replace(/[^0-9+]/g, '');

  return (
    <footer className="footer">
      <div className="footer-mainContainer">
        <div className="company-info-container">        
          <div className="name-info">
            {empresa && <strong>{empresa}</strong>}
            {slogan && <small>{slogan}</small>}
            {razonsocial && <small>{razonsocial}</small>}
            {nit && <small>{nit}</small>}
          </div>
          
          <div className="location-info">
            {dondeestamos && <strong>{dondeestamos}</strong>}            
            {ubicacion && <small>{ubicacion}</small>}            
            {direccion && <small>{direccion}</small>}            
            {correo && (
              <small>
                📧 <a href={`mailto:${correo}`}>{correo}</a>
              </small>
            )}            
            {telefono && (
              <small>
                📞 <a href={`tel:${telClean}`}>{telefono}</a>
              </small>
            )}
          </div>            
        </div>

        <div className="social-media">
          {redessociales && <h4>{redessociales}</h4>}
          <Redes socialData={{ facebook, instagram, tiktok, twitter, youtube }} />            
        </div>

        <hr className="divider" />

        <div className="final-info">
          <small>&copy; {year} {final}</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;