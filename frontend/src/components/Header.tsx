// src/components/Header.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header: React.FC = () => {
  return (
    <header>
      <div className="top-bar">
        <div className="logo">OffYou</div>
        <div className="search-bar">
          <input type="text" placeholder="Buscar..." />
        </div>
        <div>
          <button className="login-button">Login</button>
          <Link  to="/login"><button>Login</button></Link>
        </div>
      </div>

      <div className="bottom-bar">
        <div className="buttons-group">
          <Link to="/plano-de-acao"><button>Plano de Ação</button></Link>
          <Link to="/"><button>Sobre OffYou</button></Link>
          <Link to="/registro-de-atividades"><button>Registro de Atividades</button></Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
