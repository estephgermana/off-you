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
         A criação do projeto OffYou é uma resposta à necessidade de auxiliar familiares e amigos a identificar e lidar com o uso excessivo de internet e o risco de dependência em crianças de 0 a 9 anos. Escolhemos essa faixa etária com base em dados alarmantes da pesquisa TIC Kids Online Brasil 2023, que mostra um aumento expressivo no acesso precoce à internet. Além disso, seguimos as diretrizes da Organização Mundial da Saúde (OMS), Academia Americana de Pediatria (AAP) e Sociedade Brasileira de Pediatria (SBP), que alertam sobre os potenciais prejuízos do tempo de tela excessivo ao desenvolvimento saudável nessa idade.

Muitas vezes, os cuidadores não sabem reconhecer os sinais de uso problemático ou como intervir. O OffYou oferece suporte para esse desafio, visando um impacto positivo no convívio familiar, no bem-estar emocional e no desenvolvimento integral das crianças.
        </p>
      </div>
    </div>
  );
};

export default Home;
