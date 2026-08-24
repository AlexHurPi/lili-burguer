import React from 'react';
import './map-styles.css';

export const Map = () => {
  return (    
    <div className='mapMainContainer'>
        <div className="mapSeccion" >
          <h3>Estamos en Cali - Colombia</h3>  
        </div>        
        <div className="mapContainer">            
            <iframe
              title="Ubicación del restaurante"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5254.931813468884!2d-76.50129072244751!3d3.472642334374998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a7cde5b58e01%3A0x65b5fc542ac0b835!2sCra%201DBIS%20%2359-5%2C%20Comuna%205%2C%20Cali%2C%20Valle%20del%20Cauca!5e0!3m2!1ses!2sco!4v1775247531358!5m2!1ses!2sco"
              width="100%"
              height="450"              
              allowFullScreen=""
              loading="lazy"
              className='mapIframe'>
            </iframe>         
        </div>  
    </div>
  )
}
