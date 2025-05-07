import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import '../styles/Login.css';

const RecuperarSenha: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRecuperarSenha = () => {
    if (!email) {
      setMessage('Por favor, insira seu e-mail.');
      return;
    }

    console.log('Enviando link de recuperação para o e-mail:', email);
    setMessage('Link de recuperação enviado para o seu e-mail.');
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1>Recuperar Senha</h1>

        <form className="login-form">
          {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="button"
            className="submit"
            onClick={handleRecuperarSenha}
          >
            Enviar Link de Recuperação
          </button>
        </form>

         <div className="login-link">
                  Já tem conta? <Link to="/login">Faça login</Link>
                </div>
          <div className="login-link-cadastro">
                    Já tem conta? <Link to="/cadastro">Faça cadastro</Link>
                  </div>
        
      </div>
    </div>
  );
};

export default RecuperarSenha;
