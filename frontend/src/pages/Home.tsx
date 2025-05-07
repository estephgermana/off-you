import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; 

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <div className="questionario-box">
        <h1>Descubra se quem você ama precisa de ajuda para se conectar com a vida real.</h1>
        <h3>Nós te guiamos nesse percurso.</h3>
        <Link to="/questionario">
          <button className="start-button">Responda o Questionário</button>
        </Link>
        
      </div>
      
      <div className="sobre-offyou">
        <h2>Sobre OffYou</h2>
        <p>
          A criação do projeto OffYou se justifica pela necessidade de auxiliar familiares e amigos a identificar e lidar com a dependência de internet em adolescentes, um problema cada vez mais presente na sociedade atual. 
          Muitas vezes, pessoas próximas não sabem reconhecer os sinais ou como ajudar de forma adequada. 
          Dessa forma, o projeto não apenas soluciona um problema atual, mas também gera impacto positivo na convivência social e no bem-estar emocional dos envolvidos.
        </p>
      </div>
    </div>
  );
};

export default Home;
