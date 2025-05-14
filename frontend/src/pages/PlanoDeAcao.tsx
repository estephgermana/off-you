import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../styles/PlanoDeAcao.css';

type Grau = "Uso saudável" | "Dependência leve" | "Dependência moderada" | "Dependência severa";

const planos: Record<Grau, { descricao: string; atividades: string[] }> = {
  "Uso saudável": {
    descricao: "Acompanhamento leve, com incentivo a boas práticas e manutenção do equilíbrio no uso da internet.",
    atividades: [
      "Estabelecer combinados afetivos, como: 'Durante o jantar, vamos guardar os celulares?' ou 'Na hora de dormir, não ter eletrônicos no quarto.'",
      "Estimular a prática de atividades físicas - Propor exercícios leves como caminhadas, alongamentos ou esportes em grupo, para liberar endorfina e promover bem-estar físico e mental.",
      "Convidar para passeios, refeições ou momentos em grupo longe do celular.",
      "Estimular o uso equilibrado de telas por meio de elogios e reconhecimento positivo.",
      "Propor atividades divertidas offline, como jogos, caminhadas, cozinhar em grupo ou projetos manuais.",
      "Incentivar hábitos de autocuidado, como ouvir músicas relaxantes, desenhar ou escrever um diário à mão.",
      "Promover a descoberta de novos hobbies - Explorar interesses como fotografia, jardinagem, culinária ou tocar um instrumento musical.",
      "Promover um 'desafio semanal offline' com pequenas recompensas simbólicas.",
      "Estimular a participação em clubes de leitura, música ou cinema com encontros presenciais.",
      "Estimular a criação de metas semanais sobre o uso consciente da internet.",
      "Criar uma agenda física para marcar emoções e registrar o dia sem telas.",
      "Envolver gradativamente em pequenas tarefas domésticas, como tirar o lixo, guardar a louça ou organizar o quarto."
    ]
  },
  "Dependência leve": {
    descricao: "Sinais iniciais de dependência percebidos. Intervenções afetuosas podem ajudar a reequilibrar o uso da internet.",
    atividades: [
      "Criar momentos de convivência leves, como refeições ou sessões de filmes sem celulares.",
      "Estabelecer combinados afetivos, como: 'Durante o jantar, vamos guardar os celulares?' ou 'Na hora de dormir, não ter eletrônicos no quarto.'",
      "Estimular a prática de atividades físicas - Propor exercícios leves como caminhadas, alongamentos ou esportes em grupo, para liberar endorfina e promover bem-estar físico e mental.",
      "Convidar para hobbies offline, como montar quebra-cabeça, pintar, andar de bicicleta ou fazer artesanato.",
      "Conversar com empatia: 'Notei que você tem passado bastante tempo online, quer fazer outra coisa comigo por um tempo?'",
      "Criar um 'mapa do tempo' para identificar o tempo gasto nas telas e propor pequenas trocas.",
      "Usar aplicativos de controle de tempo como ferramenta de desafio divertido e colaborativo.",
      "Propor que monte uma playlist de músicas para momentos offline.",
      "Estimular a criação de metas semanais sobre o uso consciente da internet.",
      "Promover a descoberta de novos hobbies - Explorar interesses como fotografia, jardinagem, culinária ou tocar um instrumento musical.",
      "Criar uma agenda física para marcar emoções e registrar o dia sem telas.",
      "Envolver gradativamente em pequenas tarefas domésticas, como tirar o lixo, guardar a louça ou organizar o quarto."
    ]
  },
  "Dependência moderada": {
    descricao: "O uso excessivo já afeta a rotina, trazendo prejuízos visíveis. A abordagem precisa ser mais cuidadosa, com escuta ativa e incentivo ao resgate de interesses.",
    atividades: [
      "Estabelecer combinados afetivos, como: 'Durante o jantar, vamos guardar os celulares?' ou 'Na hora de dormir, não ter eletrônicos no quarto.'",
      "Estar presente, sem cobranças, mostrando-se disponível para conversar ou simplesmente estar junto.",
      "Propor atividades fora de casa, mesmo que rápidas, como uma caminhada até a padaria.",
      "Retomar algo que a pessoa costumava gostar antes, como ver fotos antigas, cuidar de plantas ou passear com um pet.",
      "Ajudar a refletir sobre como o uso da internet tem impactado sua rotina, sem julgamento.",
      "Sugerir apoio profissional com carinho, mostrando que está disposto a acompanhar nos primeiros passos.",
      "Estimular a prática de atividades físicas - Propor exercícios leves como caminhadas, alongamentos ou esportes em grupo, para liberar endorfina e promover bem-estar físico e mental.",
      "Criar uma agenda física para marcar emoções e registrar o dia sem telas.",
      "Promover a descoberta de novos hobbies - Explorar interesses como fotografia, jardinagem, culinária ou tocar um instrumento musical.",
      "Estimular a criação de metas semanais sobre o uso consciente da internet.",
      "Envolver gradativamente em pequenas tarefas domésticas, como tirar o lixo, guardar a louça ou organizar o quarto."
    ]
  },
  "Dependência severa": {
    descricao: "Há isolamento significativo e prejuízos graves no cotidiano. É necessário acolhimento contínuo, fortalecimento do vínculo e ajuda profissional.",
    atividades: [
      "Estabelecer combinados afetivos, como: 'Durante o jantar, vamos guardar os celulares?' ou 'Na hora de dormir, não ter eletrônicos no quarto.'",
      "Demonstrar acolhimento com presença, mesmo que ela esteja isolada ou usando o celular.",
      "Evitar confrontos diretos; priorizar a escuta ativa e a construção de confiança.",
      "Propor pequenas ações cotidianas, como arrumar o quarto, tomar um café juntos ou praticar um exercício físico.",
      "Relembrar afetivamente momentos bons vividos fora do ambiente digital.",
      "Acompanhar com paciência e constância, sendo um apoio silencioso e amoroso.",
      "Introduzir práticas sensoriais como pintura com os dedos, desenhar ou cozinhar.",
      "Incluir em rodas de acolhimento para orientar e fortalecer a rede de apoio.",
      "Promover a descoberta de novos hobbies - Explorar interesses como fotografia, jardinagem, culinária ou tocar um instrumento musical.",
      "Estimular a criação de metas semanais sobre o uso consciente da internet.",
      "Criar uma agenda física para marcar emoções e registrar o dia sem telas.",
      "Envolver gradativamente em pequenas tarefas domésticas, como tirar o lixo, guardar a louça ou organizar o quarto."
    ]
  }
};

export default function PlanoDeAcao() {
  const location = useLocation();
  const grauDependencia: Grau = location.state?.grau || "Uso saudável";
  const planoAtual = planos[grauDependencia];

  const [indexAtual, setIndexAtual] = useState(0);
  const [atividadesFeitas, setAtividadesFeitas] = useState<boolean[]>([]);
  const [comentarios, setComentarios] = useState<string[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<number[]>([]);

  useEffect(() => {
    const registros = JSON.parse(localStorage.getItem("registros") || "[]");
    const progressoAtual = registros.find((r: any) => r.grau === grauDependencia);
    if (progressoAtual) {
      setAtividadesFeitas(progressoAtual.atividades.map((a: any) => a.feita));
      setComentarios(progressoAtual.atividades.map((a: any) => a.comentario));
      setAvaliacoes(progressoAtual.atividades.map((a: any) => a.avaliacao || 0));
    } else {
      setAtividadesFeitas(new Array(planoAtual.atividades.length).fill(false));
      setComentarios(new Array(planoAtual.atividades.length).fill(""));
      setAvaliacoes(new Array(planoAtual.atividades.length).fill(0));
    }
  }, [planoAtual]);

  const toggleAtividade = () => {
    const novas = [...atividadesFeitas];
    novas[indexAtual] = !novas[indexAtual];
    setAtividadesFeitas(novas);
    salvarProgresso();
  };

  const atualizarComentario = (texto: string) => {
    const novos = [...comentarios];
    novos[indexAtual] = texto;
    setComentarios(novos);
    salvarProgresso();
  };

  const atualizarAvaliacao = (nota: number) => {
    const novas = [...avaliacoes];
    novas[indexAtual] = nota;
    setAvaliacoes(novas);
    salvarProgresso();
  };

  const salvarProgresso = () => {
    const registro = {
      grau: grauDependencia,
      atividades: planoAtual.atividades.map((a, i) => ({
        texto: a,
        feita: atividadesFeitas[i],
        comentario: comentarios[i],
        avaliacao: avaliacoes[i],
      })),
      data: new Date().toLocaleString(),
    };
    const registros = JSON.parse(localStorage.getItem("registros") || "[]");
    const index = registros.findIndex((r: any) => r.grau === grauDependencia);
    if (index !== -1) registros[index] = registro;
    else registros.push(registro);
    localStorage.setItem("registros", JSON.stringify(registros));
  };

  return (
    <div className="plano-container">
      <h2>{grauDependencia}</h2>
      <h4>{planoAtual.descricao}</h4>

      <div className="atividade-box">
        <button onClick={() => setIndexAtual(indexAtual - 1)} disabled={indexAtual === 0}>⬅</button>
        <div className="atividade-titulo">{planoAtual.atividades[indexAtual]}</div>
        <button onClick={() => setIndexAtual(indexAtual + 1)} disabled={indexAtual === planoAtual.atividades.length - 1}>➡</button>
      </div>

      <div className="atividade-detalhe" style={{ marginBottom: "16px" }}>
        <label>
          <input type="checkbox" checked={atividadesFeitas[indexAtual]} onChange={toggleAtividade} />
          Marcar como concluída
        </label>
      </div>
     
      {atividadesFeitas[indexAtual] && (
        <>
        <div className="avaliacao-box" style={{ marginBottom: "16px" }}>
  <label>Avalie a atividade:</label>
  <div className="avaliacao-botoes">
    {[1, 2, 3, 4, 5].map((nota) => (
      <button
        key={nota}
        className={avaliacoes[indexAtual] >= nota ? "selecionado" : ""}
        onClick={() => atualizarAvaliacao(nota)}
        aria-label={Avaliar com ${nota} estrela${nota > 1 ? 's' : ''}}
      >
        ★
      </button>
    ))}
  </div>
</div>


          <div className="comentario-box">
            <label>Fale mais sobre a experiência da Vitima:</label>
            <textarea
              value={comentarios[indexAtual]}
              onChange={(e) => atualizarComentario(e.target.value)}
              placeholder="Escreva sua experiência com essa atividade..."
            />
          </div>
        </>
      )}

      <div className="botoes">
        <button onClick={salvarProgresso} disabled={!atividadesFeitas[indexAtual]}>Salvar progresso</button>
        <Link to="/registro-de-atividades"><button>Ver Progresso</button></Link>
      </div>
    </div>
  );
}
