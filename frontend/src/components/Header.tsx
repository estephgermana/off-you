import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../images/logo.jpg';
import { useAuth } from '../context/AuthContext'; // 👈 importa

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logado, logout } = useAuth(); // 👈 pega status e logout

  return (
    <header>
      <div className="top-bar">
        <div className="logo">
          <img src={logo} alt="Logo OffYou" className="logo-image" />
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Buscar..." />
        </div>

        {logado ? (
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Sair
          </button>
        ) : (
          <button onClick={() => navigate('/login')}>Login</button>
        )}
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
