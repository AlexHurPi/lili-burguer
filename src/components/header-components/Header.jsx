// header.jsx
import React from "react";
import "./header-styles.css";
//import { Link } from 'react-router-dom';
//import TabNavigation from '../tapNavigation-components/TabNavigation';
import LanguageSelector from "../LanguageSelector-components/LanguageSelector";

const Header = ({background, image, titleText, subtitleText, titleColor, subtitleColor}) => {
  
  return (
    <header className="header" style={{backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        
        <div className="header-mainContainer"> 
            <div className="languageSelector-container" style={{display:'flex', position:'absolute', right:'5px', top:'5px', zIndex: 20}}>
              <LanguageSelector /> 
            </div>   
            <div>
              {/*<img src={""} alt="logo" style={{height:'80px'}} />} */}
            </div>            
            <div className="header-textContainer">
              <span className="header-title" style={{color: titleColor, fontFamily: 'jost-bold'}}>{titleText}</span>
              <span className="subtitle" style={{color: subtitleColor, fontFamily:'jost'}}>{subtitleText}</span>
            </div>
        </div>     
    </header>
  );
};
export default Header;
