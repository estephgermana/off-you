// src/components/Header.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../images/logo.jpg';

const Header: React.FC = () => {
  const navigate = useNavigate();

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
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>

      <div className="bottom-bar">
        <div className="green-bar-buttons">
          <button className="green-button" onClick={() => navigate('/plano-de-acao')}>
            Plano de Ação
          </button>
          <button className="green-button" onClick={() => navigate('/')}>
            Sobre OffYou
          </button>
          <button className="green-button" onClick={() => navigate('/registro-de-atividades')}>
            Registro de Atividades
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
