// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // ajuste o caminho conforme a estrutura do seu projeto

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('Logado com sucesso!', email);
  };

  const handleEsqueceuSenha = () => {
    navigate('/recuperar-senha');
  };

  const handleCadastro = () => {
    navigate('/cadastro');
  };

  return (
   
      <div className="border-container-login">
        <div className="container-login">
          <h1>Login</h1>

          <form className="container-email-senha">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            {/* Botão Entrar */}
            <button
              type="button"
              className="submit"
              onClick={handleLogin}
            >
              Entrar
            </button>
          </form>

          <p>
            <button onClick={handleEsqueceuSenha} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
              Esqueceu a senha?
            </button>
          </p>
          <p>
            <button onClick={handleCadastro} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
              Não tem login? Cadastre-se
            </button>
          </p>
        </div>
      </div>
  );
}
export default Login;