// src/components/Footer.tsx
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
          <Link to="/cnpj" className="footer-btn">CNPJ</Link>
        </div>
        
        <div className="footer-contact">
          <p>Contatos</p>
          <p>Telefone: (XX) XXXX-XXXX</p>
          <p>Email: contato@offyou.com</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
