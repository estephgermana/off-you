// src/components/Footer.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-buttons">
        <Link to="/"><button>Início do Site</button></Link>
        <Link to="/"><button>Políticas de Privacidade</button></Link>
        
      </div>

      <div className="footer-info">
        <div>
          <p>contatooffyou@gmail.com</p>
          <p>Telefone::+5511999999999</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
