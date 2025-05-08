// src/pages/Cadastro.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import '../styles/Cadastro.css';

const Cadastro: React.FC = () => {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('familiar');

  const handleCadastro = () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    setError('');
    console.log('Cadastro realizado:', { nome, email });
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
          <label>Que tipo de usuário você é?</label>
          <select value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
            <option value="familiar">Familiar</option>
            <option value="amigo">Amigo</option>
          </select>

           <label htmlFor="dataNascimento">Data de Nascimento da Vitima</label>
          <input
            type="date"
            id="dataNascimento"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
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

        <div className="login-link">
          Já tem conta? <Link to="/login">Faça login</Link>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
