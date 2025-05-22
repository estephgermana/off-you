// src/pages/RecuperarSenha.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../styles/Login.css';

const RecuperarSenha: React.FC = () => {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleRecuperarSenha = async () => {
    setMensagem('');
    setErro('');

    if (!email) {
      setErro('Por favor, insira seu e-mail.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3003/v1/recuperar-senha', { email });

      setMensagem(response.data.message);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setErro(err.response.data.message);
      } else {
        setErro('Erro ao tentar enviar o link de recuperação.');
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1>Recuperar Senha</h1>

        <form className="login-form">
          {mensagem && <div style={{ color: 'green', marginBottom: '10px' }}>{mensagem}</div>}
          {erro && <div style={{ color: 'red', marginBottom: '10px' }}>{erro}</div>}

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
          Não tem conta? <Link to="/cadastro">Faça cadastro</Link>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;
