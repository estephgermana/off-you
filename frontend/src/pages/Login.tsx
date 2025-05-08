import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import '../styles/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('Logado com sucesso!', email);
    navigate('/');
};

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1>Login</h1>

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
      </div>

    </div>
  );
};

export default Login;
