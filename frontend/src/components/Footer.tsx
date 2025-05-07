import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css'; 

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-buttons">
          <Link to="/" className="footer-btn">Início do Site</Link>
          <Link to="/politicas-de-privacidade" className="footer-btn">Políticas de Privacidade</Link>
          <a href="email:contato@offyou.com" className="footer-btn">contato@offyou.com</a> {/* Corrigido */}
          <a href="telefone:+XXXXXXXXXXXX" className="footer-btn">(XX) XXXX-XXXX</a> {/* Corrigido */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;