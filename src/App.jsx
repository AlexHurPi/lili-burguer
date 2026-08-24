import Inicio from './pages/Inicio';
import './App.css';
import './languages/i18n.js';  // ← Agrega esta línea en App.jsx para inicializar i18n
import { useTranslation } from 'react-i18next';
import Header from './components/header-components/Header';
import Footer from './components/footer-components/Footer.jsx';

function App() {
  const { t } = useTranslation();

  return (
    <>
      <Header background="var(--primary)" image={t("header.image")} titleText={t("header.title")} subtitleText={t("header.subtitle")} titleColor="var(--header-title)" subtitleColor="var(--header-title)"/>
      <Inicio />
      <Footer background="var(--primary)" dataKey="footer.infofooter"/>
    </>
  )
}

export default App
