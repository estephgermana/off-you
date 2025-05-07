// src/pages/Cadastro.tsx
import React, { useState } from 'react';
import '../styles/Cadastro.css'; // Crie esse CSS ou aproveite o que já tem

const Cadastro: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');

  const handleCadastro = () => {
    // Verificar se todos os campos foram preenchidos
    if (!nome || !email || !senha || !confirmarSenha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    // Verificar se as senhas coincidem
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    // Limpar erro caso tudo esteja correto
    setError('');

    // Cadastro realizado com sucesso (substitua por lógica real, como uma chamada à API)
    console.log('Cadastro realizado:', { nome, email });
    // Aqui você pode chamar uma API ou redirecionar o usuário
  };

  return (
    <div className="border-container-cadastro">
      <div className="container-cadastro">
        <h1>Cadastro</h1>
        <form>
          {error && <div className="error-message">{error}</div>}
          
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            placeholder="Digite seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

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

          <label htmlFor="confirmarSenha">Confirmar Senha</label>
          <input
            type="password"
            id="confirmarSenha"
            placeholder="Confirme sua senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />

          <button
            type="button"
            className="submit"
            onClick={handleCadastro}
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
