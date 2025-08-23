import React from 'react';
import { Link } from 'react-router-dom';

const BotaoProfile = ({ logout }) => (
  logout ? (
    <button id="buttom-login" onClick={logout}>SAIR</button>
  ) : (
    <Link to="/perfil"><img src="/src/images/img-perfil.png" alt="Perfil" className="nav-icon" /></Link>
  )
);

export default BotaoProfile;