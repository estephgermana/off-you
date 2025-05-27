import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

import '../styles/Login.css';

const NovaSenha: React.FC = () => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      fetchEmail(tokenParam); // busca email após receber token
    } else {
      setError('Token de redefinição não encontrado na URL.');
    }
  }, [location]);

  const fetchEmail = async (tokenParam: string) => {
    try {
      const response = await axios.post('https://off-you.onrender.com/v1/validar-token', { token: tokenParam });
      setEmail(response.data.email); // supondo que o backend retorne { email: "user@example.com" }
    } catch {
      setError('Token inválido ou expirado.');
    }
  };

  const handleNovaSenha = async () => {
    setMessage('');
    setError('');

    if (!novaSenha || !confirmarNovaSenha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const response = await axios.post('https://off-you.onrender.com/v1/redefinir-senha', {
        senha: novaSenha,
        token: token,
      });

      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erro ao tentar redefinir a senha.');
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1>Nova Senha</h1>

        <form className="login-form">
          {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

          {email && (
            <>
              <label htmlFor="email">Email da Conta</label>
              <input
                type="email"
                id="email"
                value={email}
                readOnly
                style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
              />
            </>
          )}

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
