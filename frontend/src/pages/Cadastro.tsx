import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import '../styles/Cadastro.css';

const Cadastro: React.FC = () => {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [nivel_proximidade, setNivelProximidade] = useState('medio');

  // Criando o navigate
  const navigate = useNavigate();

 const handleCadastro = async () => {
  if (!nome || !email || !senha || !confirmarSenha || !dataNascimento) {
    setError('Por favor, preencha todos os campos.');
    return;
  }

  if (senha !== confirmarSenha) {
    setError('As senhas não coincidem.');
    return;
  }

  try {
    const response = await fetch('https://off-you.onrender.com/v1/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        email,
        senha,
        data_nascimento_vitima: dataNascimento,
        nivel_proximidade:  nivel_proximidade
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Erro ao cadastrar.');
      return;
    }

    console.log('Cadastro realizado com sucesso:', data);
    navigate('/login');
  } catch (error) {
    console.error('Erro na requisição:', error);
    setError('Erro inesperado ao se cadastrar.');
  }
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
          <label>Qual nível de proximidade com a Vítima</label>
          <select value={nivel_proximidade} onChange={(e) => setNivelProximidade(e.target.value)}>
            <option value="alto">Alto</option>
            <option value="medio">Médio</option>
            <option value="baixo">Baixo</option>
          </select>

          <label htmlFor="dataNascimento">Data de Nascimento da Vítima</label>
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
