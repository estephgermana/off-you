import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/RegistroAtividade.css";

type AtividadeRegistrada = {
  texto: string;
  feita: boolean;
  comentario: string;
  avaliacao: number;
};

type RegistroCompleto = {
  grau: string;
  faixaEtaria: string;
  atividades: AtividadeRegistrada[];
  data: string;
};

const RegistroAtividade: React.FC = () => {
  const [registrosExibidos, setRegistrosExibidos] = useState<AtividadeRegistrada[]>([]);
  
  const getStorageKey = (fe: string, gd: string) => {
    const cleanFaixaEtaria = fe.replace(/[^a-zA-Z0-9]/g, '');
    const cleanGrauDependencia = gd.replace(/[^a-zA-Z0-9]/g, '');
    return `registros_${cleanFaixaEtaria}_${cleanGrauDependencia}`;
  };

  useEffect(() => {
    const atividadesConcluidasSalvas: AtividadeRegistrada[] = [];
    const keysInLocalStorage = Object.keys(localStorage);
    const registroKeys = keysInLocalStorage.filter(key => key.startsWith('registros_'));

    registroKeys.forEach(key => {
      try {
        const registroString = localStorage.getItem(key);
        if (registroString) {
          const registroObjeto: RegistroCompleto = JSON.parse(registroString);
     
          if (registroObjeto && registroObjeto.atividades && Array.isArray(registroObjeto.atividades)) {
            registroObjeto.atividades.forEach(ativ => {

              if (ativ.feita && (ativ.comentario || ativ.avaliacao > 0)) {
                atividadesConcluidasSalvas.push(ativ);
              }
            });
          }
        }
      } catch (e) {
        console.error(`Erro ao parsear registro do localStorage para a chave ${key}:`, e);
      }
    });
    
    setRegistrosExibidos(atividadesConcluidasSalvas);

  }, []);

  const usuario = "Responsável"; 

  return (
    <div className="registro-container">
      <h1>Olá, {usuario}! Aqui está o diário de atividades.</h1>

      {registrosExibidos.length === 0 ? (
        <p>Você ainda não tem nenhuma atividade salva no seu diário.</p>
      ) : (
        registrosExibidos.map((registro, index) => (
          <div key={index} className="registro-item">
            <h2>Atividade: {registro.texto}</h2>
            <div className="avaliacao-display">
                <strong>Avaliação: </strong>
                {"★".repeat(registro.avaliacao)}{"☆".repeat(5 - registro.avaliacao)}
            </div>
            <div className="comentario-diario-box">
              <p><strong>Comentário:</strong> {registro.comentario || "Nenhum comentário adicionado."}</p>
            </div>
          </div>
        ))
      )}

      <Link to="/plano-de-acao">
        <button className="voltar-btn">
          Voltar para o plano de ação
        </button>
      </Link>
    </div>
  );
};

export default RegistroAtividade;
