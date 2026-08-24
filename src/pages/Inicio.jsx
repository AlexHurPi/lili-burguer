import React from 'react';
import './inicio.css';
import Header from '../components/header-components/Header';
import { useTranslation } from 'react-i18next';
import ImageCard from '../components/image-card/ImageCard';
import { Map } from '../components/map-components/Map';
import { WhatsappButton } from '../components/whatsapp-components/whatsappButton';

const Inicio = () => {
  const { t } = useTranslation();

  return (
    <div className="inicio-mainContainer">     
        <ImageCard dataKey="cards.card1" titleKey="cards.title1" image="cards.image1" alt="image1"/>
        <ImageCard dataKey="cards.card2" titleKey="cards.title2" image="cards.image2" alt="image2"/>
        <ImageCard dataKey="cards.card3" titleKey="cards.title3" image="cards.image3" alt="image3"/>
        <ImageCard dataKey="cards.card4" titleKey="cards.title4" image="cards.image4" alt="image4"/>
        <ImageCard dataKey="cards.card5" titleKey="cards.title5" image="cards.image5" alt="image5"/>       
        <ImageCard dataKey="cards.card6" titleKey="cards.title6" image="cards.image6" alt="image6"/>
        <ImageCard dataKey="cards.card7" titleKey="cards.title7" image="cards.image7" alt="image7"/>
        <ImageCard dataKey="cards.card8" titleKey="cards.title8" image="cards.image8" alt="image8"/>
        <ImageCard dataKey="cards.card9" titleKey="cards.title9" image="cards.image9" alt="image9"/>
        <ImageCard dataKey="cards.card10" titleKey="cards.title10" image="cards.image10" alt="image10"/>      
        <ImageCard dataKey="cards.card11" titleKey="cards.title11" image="cards.image11" alt="image11"/>
        <ImageCard dataKey="cards.card12" titleKey="cards.title12" image="cards.image12" alt="image12"/>        
       
        <WhatsappButton />
    </div>
  )
}

export default Inicio
