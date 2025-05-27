import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../images/logo.jpg';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handlePlanoDeAcaoClick = () => {
    const lastAccessedFaixaEtaria = localStorage.getItem('lastAccessedFaixaEtaria');

    if (lastAccessedFaixaEtaria) {
      const encodedFaixaEtaria = encodeURIComponent(lastAccessedFaixaEtaria);
      navigate(`/plano-de-acao/${encodedFaixaEtaria}`);
    } else {
      navigate('/questionario');
    }
  };

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
          <button className="green-button" onClick={handlePlanoDeAcaoClick}>
            Plano de Ação
          </button>
          <button className="green-button" onClick={() => navigate('/')}>
            Sobre OffYou
          </button>
          <button className="green-button" onClick={() => navigate('/contato')}> 
            Contato
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
