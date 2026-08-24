import React from 'react';
import { useTranslation } from 'react-i18next';
import './languageSelector-Styles.css'

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <select className="language-selector" onChange={changeLanguage} defaultValue={i18n.language}>
      <option value="es">Español</option>
      <option value="en">English</option>
    </select>
  );
};

export default LanguageSelector;
