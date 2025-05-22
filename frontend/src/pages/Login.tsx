import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import '../styles/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [avisoLogado, setAvisoLogado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAvisoLogado(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('https://off-you.onrender.com/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Erro ao fazer login');
        return;
      }

      localStorage.setItem('token', data.token);

      console.log('Login bem-sucedido!');
      navigate('/');
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro inesperado ao fazer login.');
    }
  };

  const continuarNaTela = () => setAvisoLogado(false);
  const irParaHome = () => navigate('/');

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1>Login</h1>

        {avisoLogado ? (
          <div className="aviso-logado">
            <p>Você já está logado. Deseja continuar nesta tela para fazer outro login?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1rem' }}>
              <button onClick={continuarNaTela}>Permanecer na tela de login</button>
              <button onClick={irParaHome}>Ir para página inicial</button>
            </div>
          </div>
        ) : (
          <>
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="senha">Senha</label>
              <input
                type="password"
                id="senha"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />

              <button type="submit" onClick={handleLogin}>
                Entrar
              </button>
            </form>

            <div className="login-link-cadastro">
              Não tem conta? <Link to="/cadastro">Faça cadastro</Link>
            </div>
            <div className="login-link-recpera">
              Esqueceu a senha? <Link to="/recuperar-senha">Esqueci a senha</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
