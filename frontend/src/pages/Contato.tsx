import React from 'react';
import '../styles/Contato.css';

const Contato: React.FC = () => {
  return (
    <div className="contact-container">
      <div className="contact-card">
        <h1>Fale Conosco</h1>
        <p className="subtitle">
          Quer saber mais, tirar dúvidas ou se conectar com nossa missão?
        </p>

        <div className="contact-info">
          <h2>Informações de Contato</h2>

          <div className="info-item">
            <h3>Telefone</h3>
            <p>(81) 9 9999-9999</p>
          </div>

          <div className="info-item">
            <h3>E-mail</h3>
            <p>contatooffyou@gmail.com
</p>
          </div>

          <div className="info-item">
            <h3>Localização</h3>
            <p>Recife/PE</p>
            <p>Brasil</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contato;