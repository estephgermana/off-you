import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import '../styles/PlanoDeAcao.css';

type Grau = "Uso saudável" | "Dependência leve" | "Dependência moderada" | "Dependência severa";
type FaixaEtaria = "0-4 anos" | "5-10 anos";

const planosDeAcaoDetalhado: Record<FaixaEtaria, Record<Grau, { titulo: string; sugestoes: string[] }>> = {
  '0-4 anos': {
    'Uso saudável': {
      titulo: 'Plano de Ação: Uso Saudável (0-4 anos)',
      sugestoes: [
        'Mantenha o ambiente familiar rico em estímulos offline (brinquedos, livros, atividades ao ar livre).',
        'Limite o tempo de tela para no máximo 1 hora por dia, sempre com supervisão.',
        'Priorize brincadeiras interativas e tempo de qualidade em família.'
      ]
    },
    'Dependência leve': {
      titulo: 'Plano de Ação: Dependência Leve (0-4 anos)',
      sugestoes: [
        'Crie rotinas bem definidas para o uso de telas, com horários fixos e curtos.',
        'Ofereça alternativas divertidas e envolventes longe das telas, como pintura, massinha, blocos de montar.',
        'Aumente o tempo de interação um-a-um com a criança, com brincadeiras que estimulem a criatividade e a coordenação motora.'
      ]
    },
    'Dependência moderada': {
      titulo: 'Plano de Ação: Dependência Moderada (0-4 anos)',
      sugestoes: [
        'Reduza drasticamente o tempo de tela, preferencialmente eliminando-o temporariamente para reeducação.',
        'Busque atividades sensoriais e motoras que capturem a atenção da criança (parques, natação, caça ao tesouro).',
        'Considere a busca por apoio profissional (pediatra, psicólogo infantil) para orientação e manejo do comportamento.'
      ]
    },
    'Dependência severa': {
      titulo: 'Plano de Ação: Dependência Severa (0-4 anos)',
      sugestoes: [
        'Intervenção imediata: corte total do acesso às telas e remoção de dispositivos eletrônicos do ambiente da criança.',
        'Busque apoio psicológico e pedagógico especializado para a criança e a família.',
        'Crie um ambiente rico em estímulos não digitais e promova o máximo de interação social e física.'
      ]
    }
  },
  '5-10 anos': {
    'Uso saudável': {
      titulo: 'Plano de Ação: Uso Saudável (5-10 anos)',
      sugestoes: [
        'Incentive o uso consciente da internet para aprendizado e lazer, com supervisão parental.',
        'Estimule hobbies e atividades extracurriculares (esportes, música, artes).',
        'Mantenha o diálogo aberto sobre os perigos e benefícios da internet, ensinando sobre segurança online.'
      ]
    },
    'Dependência leve': {
      titulo: 'Plano de Ação: Dependência Leve (5-10 anos)',
      sugestoes: [
        'Defina regras claras de tempo de tela e conteúdo, com acordos e consequências.',
        'Incentive a participação em atividades em grupo e brincadeiras ao ar livre com amigos.',
        'Explore novos interesses e talentos da criança que não envolvam telas, como leitura, jogos de tabuleiro ou culinária.'
      ]
    },
    'Dependência moderada': {
      titulo: 'Plano de Ação: Dependência Moderada (5-10 anos)',
      sugestoes: [
        'Estabeleça um cronograma rigoroso de uso da internet, com períodos de "desintoxicação digital".',
        'Aumente o envolvimento em atividades familiares e sociais, buscando reconectar a criança com o mundo real.',
        'Considere a busca por aconselhamento psicológico para a criança e orientação para os pais.'
      ]
    },
    'Dependência severa': {
      titulo: 'Plano de Ação: Dependência Severa (5-10 anos)',
      sugestoes: [
        'Intervenção profissional é crucial: procure um psicólogo infantil ou psiquiatra especializado em dependência digital.',
        'Restrição total ou quase total do acesso à internet, com acompanhamento e supervisão constante.',
        'Implemente um plano de reabilitação que inclua terapias, atividades sociais e educacionais, e apoio familiar intensivo.'
      ]
    }
  }
};


export default function PlanoDeAcao() {
  const location = useLocation();
  const navigate = useNavigate();
  const { faixaEtaria: faixaEtariaParam } = useParams<{ faixaEtaria: string }>();

  const grauDependencia = (location.state?.grau as Grau) || "Uso saudável";
  const faixaEtaria = (faixaEtariaParam as FaixaEtaria) || "0-4 anos";
  const planoAtual = planosDeAcaoDetalhado[faixaEtaria]?.[grauDependencia];

  useEffect(() => {
    if (!planoAtual || !Object.keys(planosDeAcaoDetalhado).includes(faixaEtaria)) {
      console.warn("Plano de ação não encontrado para a combinação de faixa etária e grau. Redirecionando.");
      navigate('/questionario');
    }
  }, [planoAtual, navigate, faixaEtaria]);

  const [indexAtual, setIndexAtual] = useState(0);
  const [atividadesFeitas, setAtividadesFeitas] = useState<boolean[]>([]);
  const [comentarios, setComentarios] = useState<string[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<number[]>([]);

  const getStorageKey = (fe: FaixaEtaria, gd: Grau) => {
    const cleanFaixaEtaria = fe.replace(/[^a-zA-Z0-9]/g, '');
    const cleanGrauDependencia = gd.replace(/[^a-zA-Z0-9]/g, '');
    return `registros_${cleanFaixaEtaria}_${cleanGrauDependencia}`;
  };

  useEffect(() => {
    if (planoAtual) {
      const storageKey = getStorageKey(faixaEtaria, grauDependencia);
      
      const registroSalvo = localStorage.getItem(storageKey);

      if (registroSalvo) {
        try {
          const progressoAtual = JSON.parse(registroSalvo);

          if (progressoAtual && progressoAtual.atividades) {

            if (progressoAtual.grau === grauDependencia && progressoAtual.faixaEtaria === faixaEtaria) {
                setAtividadesFeitas(progressoAtual.atividades.map((a: any) => a.feita));
                setComentarios(progressoAtual.atividades.map((a: any) => a.comentario));
                setAvaliacoes(progressoAtual.atividades.map((a: any) => a.avaliacao || 0));
            } else {
                setAtividadesFeitas(new Array(planoAtual.sugestoes.length).fill(false));
                setComentarios(new Array(planoAtual.sugestoes.length).fill(""));
                setAvaliacoes(new Array(planoAtual.sugestoes.length).fill(0));
            }
          } else {

            setAtividadesFeitas(new Array(planoAtual.sugestoes.length).fill(false));
            setComentarios(new Array(planoAtual.sugestoes.length).fill(""));
            setAvaliacoes(new Array(planoAtual.sugestoes.length).fill(0));
          }
        } catch (e) {
          console.error("Erro ao parsear registro do localStorage:", e);

          setAtividadesFeitas(new Array(planoAtual.sugestoes.length).fill(false));
          setComentarios(new Array(planoAtual.sugestoes.length).fill(""));
          setAvaliacoes(new Array(planoAtual.sugestoes.length).fill(0));
        }
      } else {

        setAtividadesFeitas(new Array(planoAtual.sugestoes.length).fill(false));
        setComentarios(new Array(planoAtual.sugestoes.length).fill(""));
        setAvaliacoes(new Array(planoAtual.sugestoes.length).fill(0));
      }
    }
  }, [planoAtual, faixaEtaria, grauDependencia]);

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

  const atualizarAvaliacao = (nota: number) => {
    const novas = [...avaliacoes];
    novas[indexAtual] = nota;
    setAvaliacoes(novas);
  };

  const salvarProgresso = () => {
    if (!planoAtual) {
      console.warn("Plano de ação não disponível, não é possível salvar.");
      return;
    }

    const registroParaSalvar = {
      grau: grauDependencia,
      faixaEtaria: faixaEtaria,
      atividades: planoAtual.sugestoes.map((a, i) => ({
        texto: a,
        feita: atividadesFeitas[i],
        comentario: comentarios[i],
        avaliacao: avaliacoes[i],
      })),
      data: new Date().toLocaleString(),
    };

    const storageKey = getStorageKey(faixaEtaria, grauDependencia);
 
    localStorage.setItem(storageKey, JSON.stringify(registroParaSalvar));
    console.log(`Progresso salvo para ${faixaEtaria} - ${grauDependencia} na chave: ${storageKey}`);
    alert("Progresso salvo com sucesso!");
  };

  if (!planoAtual) {
    return <div>Carregando Plano de Ação ou redirecionando...</div>;
  }

  const isSaveButtonDisabled = !atividadesFeitas[indexAtual] || (comentarios[indexAtual] === "" && avaliacoes[indexAtual] === 0);

  return (
    <div className="plano-container">
      <h2>{planoAtual.titulo}</h2>
      <h4>Grau de Dependência: {grauDependencia}</h4>
      <h4>Faixa Etária: {faixaEtaria}</h4>

      <div className="atividade-box">
        <button onClick={() => setIndexAtual(prev => prev - 1)} disabled={indexAtual === 0}>⬅</button>
        <div className="atividade-titulo">{planoAtual.sugestoes[indexAtual]}</div>
        <button onClick={() => setIndexAtual(prev => prev + 1)} disabled={indexAtual === planoAtual.sugestoes.length - 1}>➡</button>
      </div>

      <div className="atividade-detalhe" style={{ marginBottom: "16px" }}>
        <label>
          <input type="checkbox" checked={atividadesFeitas[indexAtual]} onChange={toggleAtividade} />
          Marcar como concluída
        </label>
      </div>

      {/* Mostra avaliação e comentário apenas se a atividade estiver marcada como concluída */}
      {atividadesFeitas[indexAtual] && (
        <>
          <div className="avaliacao-box" style={{ marginBottom: "16px" }}>
            <label>Avalie a atividade:</label>
            <div className="avaliacao-botoes">
              {[1, 2, 3, 4, 5].map((nota) => (
                <button key={nota} className={avaliacoes[indexAtual] === nota ? "selecionado" : ""} onClick={() => atualizarAvaliacao(nota)}>{nota}</button>
              ))}
            </div>
          </div>

          <div className="comentario-box">
            <label>Fale mais sobre a experiência:</label>
            <textarea
              value={comentarios[indexAtual]}
              onChange={(e) => atualizarComentario(e.target.value)}
              placeholder="Escreva sua experiência com essa atividade..."
            />
          </div>
        </>
      )}

      <div className="botoes">
        {}
        <button onClick={salvarProgresso} disabled={isSaveButtonDisabled}>Salvar progresso</button>
        <Link to="/registro-de-atividades"><button>Ver Progresso</button></Link>
      </div>
    </div>
  );
}
