// src/components/Header.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../images/logo.jpg';


const Header: React.FC = () => {
  return (
    <header>
      <div className="top-bar">
      <div className="logo">
  <img src={logo} alt="Logo OffYou" className="logo-image" />
</div>

        <div className="search-bar">
          <input type="text" placeholder="Buscar..." />
        </div>
        <div>
          <Link  to="/login"><button>Login</button></Link>
        </div>
      </div>

      <div className="bottom-bar">
        <div className="green-bar-buttons">
          <Link to="/plano-de-acao"><button className="green-button">Plano de Ação</button></Link>
          <Link to="/"><button className="green-button">Sobre OffYou</button></Link>
          <Link to="/registro-de-atividades"><button className="green-button">Registro de Atividades</button></Link>
        </div>

      </div>
    </header>
  );
}

export default Header;