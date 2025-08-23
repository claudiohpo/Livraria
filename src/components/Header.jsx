import React from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav';
import BotaoLogin from './BotaoLogin';
import BotaoProfile from './BotaoProfile';
import BotaoCarrinho from './BotaoCarrinho'; // Assuming this component exists or will be created
import { useAuth } from '../context/AuthLogin';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <h1><Link to="/">MARTHE</Link></h1>
      <Nav user={user} />
      <div className="header-right-group">
        {user && user.tipoUsuario === 'cliente' && (
          <>
            <BotaoCarrinho />
            <BotaoProfile />
          </>
        )}
        {user && user.tipoUsuario === 'colaborador' && (
          <BotaoProfile logout={logout} />
        )}
        {!user && (
          <BotaoLogin />
        )}
      </div>
    </header>
  );
};

export default Header;
