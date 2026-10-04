/* 
* Este componente se encarga de hacer que la ventana se mueva al inicio (coordenadas x:0, y:0) cada vez que cambia la ruta en el navegador.
* Para utilizar este componente, se importa en App y se pone sobre las rutas que se quieran que se muevan al inicio.
*/

import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType(); // Detecta si es 'PUSH' (avanzar) o 'POP' (volver atrás)

  useEffect(() => {
    // Si el usuario avanza a una nueva página (PUSH), la pantalla sube al inicio.
    // Si vuelve atrás (POP), NO forzamos scroll, permitiendo que el navegador recuerde la posición.
    if (navType !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [pathname, navType]);

  return null;
};

export default ScrollToTop;