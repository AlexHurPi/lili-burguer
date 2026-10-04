import React from 'react';
import './header-styles.css';
import LanguageSelector from '../LanguageSelector-components/LanguageSelector';
import { useMenu } from '../../context/MenuContext';

const Header = () => {
  const { menuData } = useMenu();

  const headerInfo = menuData?.header || {};
  const {
    title = 'Lili-Hamburger',
    subtitle = 'TU ANTOJO, AL INSTANTE',
    image = './images/Encabezado.webp'
  } = headerInfo;

  return (
    <header
      className="header"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="header-mainContainer">
        <div className="languageSelector-container">
          {/* <LanguageSelector /> */}
        </div>

        <div className="header-textContainer">
          <span className="header-title">{title}</span>
          <span className="header-subtitle">{subtitle}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;