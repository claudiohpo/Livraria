import React from 'react';
import { Link } from 'react-router-dom';

const BotaoOpcoes = ({ logout }) => (
  <div className="botao-opcoes">
    {/* Link para a tela de Perfil */}
    <Link to="/perfil">
      <img src="/src/images/img-perfil.png" alt="Perfil" className="icone-perfil" />
    </Link>

    {/* Link para a tela do Carrinho */}
    <Link to="/carrinho">
      <img src="/src/images/img-sacola.png" alt="Carrinho" className="icone-sacola" />
    </Link>

  </div>
);

export default BotaoOpcoes;