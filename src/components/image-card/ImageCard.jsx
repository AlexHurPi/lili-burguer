import React from 'react';
import './imageCard-styles.css';
import { useTranslation } from 'react-i18next';

const ImageCard = ({ dataKey, titleKey, image, alt }) => {
  const { t } = useTranslation();

  const rawProducts = t(dataKey, { returnObjects: true });
  const products = Array.isArray(rawProducts) ? rawProducts : [];

  return (
    <div className='imageCard-mainContainer'>
      {titleKey && (
        <div className="seccion">
          <h3>{t(titleKey)}</h3>
        </div>
      )}

      <div className="tarjeta">
        <div className="contImagenProducto">
          <img src={t(image)} alt={alt} />
        </div>

        <div className="contSubtitulos">
          {products.map((product, index) => (
            <React.Fragment key={index}>{/* Usamos React.Fragment para evitar agregar un div extra, esto es mas eficiente y mas limpio ya que no afecta el DOM */}
              <div className="productoPrecio">
                <h4>{product.title}</h4>
                <h4>${product.price}</h4>
              </div>
              {/*El siguiente codigo se puede reemplazar con el CODIGO OPTIMIZADO que se comento al final, pero se deja asi para que sea mas facil de entender mantener*/}
              {product.product1 || product.product2 || product.product3 || product.product4 ? (
                  <ul>
                    {product.product1 && <li>{product.product1}</li>}
                    {product.product2 && <li>{product.product2}</li>}
                    {product.product3 && <li>{product.product3}</li>}
                    {product.product4 && <li>{product.product4}</li>}
                  </ul>
                ) : null}           
              {product.ingredient1 && <p>{product.ingredient1}</p>} 
              {product.ingredient2 && <p>{product.ingredient2}</p>}   
              {product.ingredient3 && <p>{product.ingredient3}</p>} 
              {product.ingredient4 && <p>{product.ingredient4}</p>}         
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
/* CODIGO OPTIMIZADO:*/
/*este código comentado es una versión optimizada y tecnica que utiliza un solo map para renderizar tanto los productos como los ingredientes, eliminando la necesidad de múltiples condicionales y mejorando la legibilidad del código. se comenta porque para su entendimiento se necesita mas conocimiento de programación en JS, pero es una forma mas eficiente de renderizar los productos e ingredientes sin necesidad de escribir código repetitivo para cada uno de ellos.*/
/*
{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                  .flatMap((num) => [
                    { type: 'product', text: product[`product${num}`] },
                    { type: 'ingredient', text: product[`ingredient${num}`] }
                  ])
                  .filter((item) => item.text)
                  .map((item, index) => (
                    <p key={index}>
                      {item.type === 'product' && '⏺︎ '}
                      {item.text}
                    </p>
                  ))}
*/