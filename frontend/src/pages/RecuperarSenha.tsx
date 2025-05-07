// src/pages/RecuperarSenha.tsx
import React, { useState } from 'react';

const RecuperarSenha: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleRecuperarSenha = () => {
    if (!email) {
      setMessage('Por favor, insira seu e-mail.');
      return;
    }

    // Lógica para enviar o link de recuperação de senha 
    console.log('Enviando link de recuperação para o e-mail:', email);

    // Simulando a mensagem de sucesso
    setMessage('Link de recuperação enviado para o seu e-mail.');
  };

  return (
    <div className="container-recuperar-senha">
      <h1>Recuperação de Senha</h1>
      <form>
        {message && <div className="message">{message}</div>}

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
    </div>
  );
};

export default RecuperarSenha;
