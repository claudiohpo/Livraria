import React from 'react';
import '../styles/Home.css'; 
import modelo from '../images/image_banner.png'; // Importe a imagem de destaque
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <div className="banner-container">
      <div className="banner-content">
        <h1 className="banner-title">MERGULHE EM NOVAS HISTÓRIAS!</h1>
        <h2 className="banner-subtitle">Histórias que marcam, livros que inspiram!</h2>
        <button className="banner-button">
          <Link className='banner-button-legend' to="/livros">COMPRE AGORA</Link>
        </button>
      </div>
      <img src={modelo} alt="Capa de livro em destaque" className="banner-image" />
    </div>
  );
};

export default Banner;
