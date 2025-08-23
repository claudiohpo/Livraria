import React from 'react';
import { Link } from 'react-router-dom';

const Nav = ({ user }) => (
  <nav className="nav">
    <ul>
      {user && user.tipoUsuario === 'colaborador' ? (
        <>
          <li><Link to="/consultar-cliente">CLIENTES</Link></li>
          <li><Link to="/relatorios">RELATÓRIOS</Link></li>
          <li><Link to="/pedidos">PEDIDOS</Link></li>
          <li><Link to="/consultar-livros">LIVROS</Link></li>
        </>
      ) : (
        <>
          <li><Link to="/ia-recomenda">IA RECOMENDA</Link></li>
          <li><Link to="/livros">LIVROS</Link></li>
        </>
      )}
    </ul>
  </nav>
);

export default Nav;