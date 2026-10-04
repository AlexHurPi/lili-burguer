import React from 'react';
import './imageCard-styles.css';
import { useTranslation } from 'react-i18next';

const ImageCard = ({ dataKey }) => {
  const { t } = useTranslation();

  const rawProducts = t(dataKey, { returnObjects: true });
  const products = Array.isArray(rawProducts) ? rawProducts : [];

  if (products.length === 0) return null;

  // Extraemos la cabecera (primer objeto con main-title e image) y los platillos
  const [headerInfo, ...itemList] = products;

  const mainTitle = headerInfo?.mainTitle;
  const imageSrc = headerInfo?.image;

  return (
    <div className="imageCard-mainContainer">      
      {mainTitle && (
        <div className="section">
          <h3>{mainTitle}</h3>
        </div>
      )}
      
      <div className="imageCard-card">       
        {imageSrc && (
          <div className="imageContainer">
            <img src={imageSrc} alt={mainTitle || 'Imagen producto'} />
          </div>
        )}

        {/* Lista de productos y precios con "contSubtitulos" */}
        <div className="contSubtitulos">
          {itemList.map((product, index) => (
            <React.Fragment key={index}>
              <div className="productoPrecio">
                <h4>{product.title}</h4>
                <h4>{product.price}</h4>
              </div>

              {/* Lista opcional de variaciones / presentaciones */}
              {(product.product1 || product.product2 || product.product3 || product.product4) && (
                <ul>
                  {product.product1 && <li>{product.product1}</li>}
                  {product.product2 && <li>{product.product2}</li>}
                  {product.product3 && <li>{product.product3}</li>}
                  {product.product4 && <li>{product.product4}</li>}
                </ul>
              )}

              {/* Ingredientes / Descripciones */}
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