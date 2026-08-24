import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import spanish from './spanish.json';  // ← Importa el archivo de español
import english from './english.json';  // ← Importa el archivo de inglés

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: spanish }, // ← Recurso para español
      en: { translation: english }  // ← Recurso para inglés
    },
    lng: 'es',  // Idioma por defecto
    fallbackLng: 'en', // Si no se encuentra la traducción en español, usar inglés
    interpolation: { escapeValue: false }// React ya se encarga de escapar los valores
  });

export default i18n;
