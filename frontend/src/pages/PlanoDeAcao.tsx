import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../styles/PlanoDeAcao.css';

type Grau = "Uso saudável" | "Dependência leve" | "Dependência moderada" | "Dependência severa";

const planos: Record<Grau, { descricao: string; atividades: string[] }> = {
  "Uso saudável": {
    descricao: "Acompanhamento leve e incentivo a boas práticas.",
    atividades: [
      "Convidar para passeios, refeições ou momentos em grupo longe do celular.",
      "Incentivar o uso equilibrado de telas com elogios e reconhecimento.",
      "Propor atividades divertidas offline, como jogos, caminhadas, ou cozinhar juntos.",
      "Estimular pequenos desafios como: 'Vamos deixar o celular de lado por um tempo e fazer algo diferente juntos?'",
    ],
  },
  "Dependência leve": {
    descricao: "Sinais iniciais de dependência percebidos.",
    atividades: [
      "Criar momentos de convivência leves, como refeições ou filmes sem celulares por perto.",
      "Estabelecer combinados afetivos como: 'Durante o jantar, vamos deixar os celulares guardados?'",
      "Convidar para hobbies offline, como montar quebra-cabeça, pintar ou andar de bicicleta juntos.",
      "Conversar com empatia, dizendo: 'Notei que você tem passado bastante tempo online, quer fazer outra coisa comigo por um tempo?'",
    ],
  },
  "Dependência moderada": {
    descricao: "Prejuízos percebidos e rotina afetada.",
    atividades: [
      "Estar presente, sem cobranças, mostrando-se disponível para conversar ou apenas estar junto.",
      "Propor atividades fora de casa, mesmo rápidas, como uma caminhada ou uma ida até uma padaria.",
      "Retomar algo que a pessoa costumava gostar antes, como ver um álbum de fotos, cuidar de plantas ou ouvir música juntos.",
      "Ajudar a perceber como o uso da internet está impactando a rotina e oferecer acolhimento para buscar ajuda.",
      "Sugerir apoio profissional com carinho, mostrando que está disposto a acompanhar.",
    ],
  },
  "Dependência severa": {
    descricao: "Isolamento e prejuízos graves observados.",
    atividades: [
      "Demonstrar acolhimento com presença, mesmo que a pessoa esteja isolada ou usando o celular.",
      "Evitar confrontos diretos; priorizar a escuta e a construção de confiança.",
      "Sugerir pequenas ações juntos, como abrir a janela, tomar um café, ou ouvir uma música.",
      "Relembrar afetivamente momentos bons que viveram juntos fora do ambiente digital.",
      "Acompanhar com paciência e constância, sendo um apoio silencioso e amoroso.",
    ],
  },
};

export default function PlanoDeAcao() {
  const location = useLocation();
  const grauDependencia: Grau = location.state?.grau || "Uso saudável";
  const planoAtual = planos[grauDependencia];

  const [indexAtual, setIndexAtual] = useState(0);
  const [atividadesFeitas, setAtividadesFeitas] = useState<boolean[]>([]);
  const [comentarios, setComentarios] = useState<string[]>([]);

  useEffect(() => {
    setAtividadesFeitas(new Array(planoAtual.atividades.length).fill(false));
    setComentarios(new Array(planoAtual.atividades.length).fill(""));
  }, [planoAtual]);

  const toggleAtividade = () => {
    const novas = [...atividadesFeitas];
    novas[indexAtual] = !novas[indexAtual];
    setAtividadesFeitas(novas);
  };

  const atualizarComentario = (texto: string) => {
    const novos = [...comentarios];
    novos[indexAtual] = texto;
    setComentarios(novos);
  };

  const salvarProgresso = () => {
    const registro = {
      grau: grauDependencia,
      atividades: planoAtual.atividades.map((a, i) => ({
        texto: a,
        feita: atividadesFeitas[i],
        comentario: comentarios[i],
      })),
      data: new Date().toLocaleString(),
    };
    const registros = JSON.parse(localStorage.getItem("registros") || "[]");
    registros.push(registro);
    localStorage.setItem("registros", JSON.stringify(registros));
    alert("Progresso salvo!");
  };

  return (
    <div className="plano-container">
      <h2>{grauDependencia}</h2>
      <h4>{planoAtual.descricao}</h4>

      <div className="atividade-box">
        <button
          className="seta-esquerda"
          onClick={() => setIndexAtual(indexAtual - 1)}
          disabled={indexAtual === 0}
        >
          ⬅
        </button>
        <div className="atividade-titulo">
          {planoAtual.atividades[indexAtual]}
        </div>
        <button
          className="seta-direita"
          onClick={() => setIndexAtual(indexAtual + 1)}
          disabled={indexAtual === planoAtual.atividades.length - 1}
        >
          ➡
        </button>
      </div>

      <div className="atividade-detalhe">
        <label>
          <input
            type="checkbox"
            checked={atividadesFeitas[indexAtual]}
            onChange={toggleAtividade}
          />
          Marcar como concluída
        </label>
      </div>

      <div className="comentario-box">
        <label>Fale mais sobre sua experiência:</label>
        <textarea
          value={comentarios[indexAtual]}
          onChange={(e) => atualizarComentario(e.target.value)}
          placeholder="Escreva sua experiência com essa atividade..."
        />
      </div>

      <div className="botoes">
        <button onClick={salvarProgresso} disabled={!atividadesFeitas[indexAtual]}>
          Salvar progresso
        </button>
        <Link to="/registro-de-atividades">
          <button>Ver Progresso</button>
        </Link>
      </div>
    </div>
  );
}
