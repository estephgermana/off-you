// src/pages/Login.tsx
import React, { useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    // Lógica de login aqui
    console.log('Logado com sucesso!', email);
  };

  return (
    <div>
      <h1>Login</h1>
      <form>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
        />
        <button type="button" onClick={handleLogin}>Entrar</button>
      </form>
    </div>
  );
};

export default Login;
