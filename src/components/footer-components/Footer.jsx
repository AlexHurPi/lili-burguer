import React from "react";
import "./footer.css";
import { useTranslation } from "react-i18next";
import Redes from "../redes-sociales/redes";

export default function Footer({background, dataKey}) {
  const year = new Date().getFullYear();
  const { t } = useTranslation();
  const rawinformation = t(dataKey, { returnObjects: true });
  const information = Array.isArray(rawinformation) ? rawinformation : [];

  return (
    <footer className="footer" style={{ backgroundColor: background }}>
      {information.map((info, index) => (
      <React.Fragment key={index}>      
      <div className="footer-mainContainer">
        <div className="company-info-container">         
            <div className="name-info">
              {info.empresa && <strong>{info.empresa}</strong>}
              {info.slogan && <small >{info.slogan}</small>}
              {info.razonsocial && <small >{info.razonsocial}</small>}
              {info.nit && <small >{info.nit}</small>}
            </div>
            
            <div className="location-info">
              {info.dondeestamos && <strong>{info.dondeestamos}</strong>}             
              {info.ubicacion && <small>{info.ubicacion}</small>}             
              {info.direccion && <small>{info.direccion}</small>}            
              {info.correo && <small>📧 {info.correo}</small>}             
              {info.telefono && <small>📞 {info.telefono}</small>}
            </div>            
        </div>
        <div className="social-media">
              <h4>{info.redessociales}</h4>
              <Redes />            
            </div>
        <div ></div>
        <hr className="divider"/>
        <div className="final-info">
          <small>&copy; {year} {info.final}</small>
        </div>
      </div>
      </React.Fragment>
      ))}
    </footer>
  );
}
