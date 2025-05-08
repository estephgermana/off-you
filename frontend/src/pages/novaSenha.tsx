import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import '../styles/Login.css';

const NovaSenha: React.FC = () => {
  const [token, setToken] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleNovaSenha = () => {
    if ( !novaSenha || !confirmarNovaSenha) {
      setMessage('Por favor, preencha todos os campos.');
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      setMessage('As senhas não coincidem.');
      return;
    }

    console.log('Nova senha:', novaSenha);
    setMessage('Senha alterada com sucesso!');
    
    // Após sucesso, redirecionar para a tela de login
    navigate('/login');
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1>Nova Senha</h1>

        <form className="login-form">
          {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}


          <label htmlFor="novaSenha">Nova Senha</label>
          <input
            type="password"
            id="novaSenha"
            placeholder="Digite sua nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />

          <label htmlFor="confirmarNovaSenha">Confirmar Nova Senha</label>
          <input
            type="password"
            id="confirmarNovaSenha"
            placeholder="Confirme sua nova senha"
            value={confirmarNovaSenha}
            onChange={(e) => setConfirmarNovaSenha(e.target.value)}
          />

          <button
            type="button"
            className="submit"
            onClick={handleNovaSenha}
          >
            Alterar Senha
          </button>
        </form>

        <div className="login-link">
          Já tem conta? <Link to="/login">Faça login</Link>
        </div>
      </div>
    </div>
  );
};

export default NovaSenha;
