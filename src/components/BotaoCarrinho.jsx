import React from 'react';
import { Link } from 'react-router-dom';

const BotaoCarrinho = () => (
  <Link to="/carrinho"><img src="/src/images/img-sacola.png" alt="Carrinho" className="nav-icon" /></Link>
);

export default BotaoCarrinho;