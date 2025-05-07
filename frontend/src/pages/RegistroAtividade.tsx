import React, { useState } from "react";
import "../styles/RegistroAtividade.css";

type Registro = {
  atividade: string;
  comentario: string;
  concluida: boolean;
  pontos: number;
  data: string;
};

const RegistroAtividade: React.FC = () => {
  const [registros] = useState<Registro[]>([
    {
      atividade: "Convidar para passeios, refeições ou momentos em grupo longe do celular.",
      comentario: "Foi muito bom, aprendi bastante!",
      concluida: true,
      pontos: 30,
      data: "2025-05-07",
    },
    {
      atividade: "Incentivar o uso equilibrado de telas com elogios e reconhecimento.",
      comentario: "Foi desafiador, mas consegui completar.",
      concluida: true,
      pontos: 50,
      data: "2025-05-06",
    },
  ]);

  const usuario = "Fulano";
  const pontosTotais = registros
    .filter((r) => r.concluida)
    .reduce((total, r) => total + r.pontos, 0);

  const calcularEstrelas = (pontos: number) => {
    if (pontos >= 100) return 5;
    if (pontos >= 75) return 4;
    if (pontos >= 50) return 3;
    if (pontos >= 25) return 2;
    if (pontos > 0) return 1;
    return 0;
  };

  const estrelas = calcularEstrelas(pontosTotais);
  const atividadesConcluidas = registros.filter((r) => r.concluida);

  return (
    <div className="registro-container">
      <h1>Olá, {usuario}! Aqui está seu diário com o registro de atividades.</h1>

      <div className="pontos-container">
        <p><strong>Pontos:</strong> {pontosTotais}</p>
        <p><strong>Estrelas:</strong> {"★".repeat(estrelas)}{"☆".repeat(5 - estrelas)}</p>
      </div>

      {atividadesConcluidas.length === 0 ? (
        <p>Você ainda não concluiu nenhuma atividade.</p>
      ) : (
        atividadesConcluidas.map((registro, index) => (
          <div key={index} className="registro-item">
            <h2>Atividade: {registro.atividade}</h2>
            <p className="data-atividade">{registro.data}</p>
            <div className="comentario-diario-box">
              <p><strong>Comentário:</strong> {registro.comentario || "Nenhum comentário adicionado."}</p>
            </div>
          </div>
        ))
      )}

      <button className="voltar-btn" onClick={() => window.location.href = "/plano-de-acao"}>
        Voltar para o plano de ação
      </button>
    </div>
  );
};

export default RegistroAtividade;
