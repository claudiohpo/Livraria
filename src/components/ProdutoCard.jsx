import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProdutoCard = ({ id, capaUrl, titulo, autor, preco, estoque, onClick }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/tela-produto/${id}`);
    }
  };

  return (
    <div className={`card ${estoque === 0 ? 'out-of-stock' : ''}`} onClick={handleClick}>
      <img src={capaUrl} alt={titulo} className="card-image" />
      <div className="card-info">
        <div className="card-text-content">
          <h3 className="card-title">{titulo}</h3>
          <p className="card-author">{autor}</p>
        </div>
        <p className="card-price">R${preco}</p>
      </div>
    </div>
  );
};

export default ProdutoCard;
