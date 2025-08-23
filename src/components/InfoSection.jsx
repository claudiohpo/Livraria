import React from 'react';
import { Link } from 'react-router-dom';
import './../styles/InfoSection.css'; // Criaremos este arquivo a seguir

const InfoSection = () => (
  <footer className="footer-container">
    <div className="footer-content">
      <div className="footer-section">
        <h3 className="footer-title">MARTHE</h3>
        <p>Sua livraria online, com os melhores títulos e recomendações personalizadas.</p>
      </div>
      <div className="footer-section">
        <h3 className="footer-title">Navegação</h3>
        <ul className="footer-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Livros</Link></li>
          <li><Link to="/novidades">Novidades</Link></li>
          <li><Link to="/ia-recomenda">IA Recomenda</Link></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3 className="footer-title">Contato</h3>
        <ul className="footer-links">
          <li>Email: contato@marthe.com</li>
          <li>Telefone: (11) 99999-9999</li>
        </ul>
      </div>
      <div className="footer-section">
        <h3 className="footer-title">Redes Sociais</h3>
        <div className="social-icons">
          {/* O ideal é substituir por ícones SVG ou de uma biblioteca */}
          <a href="#" aria-label="Facebook">FB</a>
          <a href="#" aria-label="Instagram">IG</a>
          <a href="#" aria-label="Twitter">TW</a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2025 MARTHE. Todos os direitos reservados.</p>
    </div>
  </footer>
);

export default InfoSection;