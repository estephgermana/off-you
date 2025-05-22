// src/pages/Questionario.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../styles/Questionario.css';

const perguntas = [
  "00/15 - Qual a faixa etária da criança?",
  "01/15 - A pessoa fica irritada ou ansiosa quando não tem acesso à internet?",
  "02/15 - A pessoa passa muito mais tempo online do que inicialmente planejava?",
  "03/15 - A pessoa deixa de cumprir compromissos (trabalho, escola, tarefas) por estar conectada à internet?",
  "04/15 - A pessoa parece precisar de mais tempo online para se sentir satisfeita?",
  "05/15 - Você já percebeu que a pessoa tentou reduzir o tempo online e não conseguiu?",
  "06/15 - A pessoa evita encontros familiares ou sociais para ficar conectada?",
  "07/15 - A pessoa minimiza ou mente sobre o tempo que passa na internet?",
  "08/15 - A pessoa recorre à internet quando está triste, ansiosa ou irritada?",
  "09/15 - A pessoa mostra sinais de irritação, tristeza ou nervosismo quando está sem internet?",
  "10/15 - O uso da internet está prejudicando o desempenho acadêmico, profissional ou social da pessoa?",
  "11/15 - A pessoa parece perder a noção do tempo enquanto está online?",
  "12/15 - A pessoa prefere interações online em vez de conversas presenciais?",
  "13/15 - A pessoa sacrifica horas de sono para ficar conectada?",
  "14/15 - A pessoa demonstra preocupação ou ansiedade excessiva quando não pode usar a internet?",
  "15/15 - Você já presenciou a pessoa falhar repetidamente em controlar o tempo de conexão?"
];


const alternativasQuestao = ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"];

const alternativasFaixaEtaria = ["0-4 anos", "5-10 anos"];

const resultadosGerais = [
  {
    grau: 'Uso saudável',
    descricao: 'A pessoa tem um relacionamento equilibrado com a internet. Usa a rede para trabalho, estudo ou lazer sem prejuízos evidentes em sua rotina.',
    comportamentos: [
      'Consegue alternar facilmente entre atividades online e offline.',
      'Não apresenta sinais de irritação quando está desconectada.',
      'Mantém interações sociais presenciais saudáveis.'
    ]
  },
  {
    grau: 'Dependência leve',
    descricao: 'Indica sinais iniciais de uso excessivo da internet. A pessoa começa a demonstrar dificuldades leves para equilibrar o uso com suas atividades do dia a dia.',
    comportamentos: [
      'Atrasos leves em tarefas ou compromissos.',
      'Preferência por atividades online em vez de presenciais, mas ainda sem isolamento completo.',
      'Pequena irritabilidade ao se desconectar.'
    ]
  },
  {
    grau: 'Dependência moderada',
    descricao: 'O uso da internet já está causando impactos perceptíveis no cotidiano, como piora no desempenho escolar, trabalho ou relacionamentos.',
    comportamentos: [
      'Evita compromissos para ficar online.',
      'Irrita-se com facilidade quando não está conectado(a).',
      'Sono irregular e fadiga.',
      'Interações sociais começam a ser substituídas por virtuais.'
    ]
  },
  {
    grau: 'Dependência severa',
    descricao: 'A internet domina significativamente a rotina da pessoa. Há prejuízos graves em diversas áreas da vida — acadêmica, profissional, social e emocional.',
    comportamentos: [
      'Isolamento social significativo.',
      'Falta de higiene, desorganização da rotina, sedentarismo extremo.',
      'Episódios de agressividade, insônia ou fuga da realidade.',
      'Recusa em aceitar ajuda ou admitir o problema.'
    ]
  }
];

const Questionario: React.FC = () => {
  const [indicePergunta, setIndicePergunta] = useState(0);
  const [respostas, setRespostas] = useState<number[]>(new Array(perguntas.length - 1).fill(-1));
  const [faixaEtariaSelecionada, setFaixaEtariaSelecionada] = useState<string | null>(null);
  const [resultadoGrau, setResultadoGrau] = useState<typeof resultadosGerais[0] | null>(null);

  const navigate = useNavigate();

  const handleResposta = (index: number) => {
    if (indicePergunta === 0) {
      setFaixaEtariaSelecionada(alternativasFaixaEtaria[index]);
    } else {
      const novasRespostas = [...respostas];
      novasRespostas[indicePergunta - 1] = index;
      setRespostas(novasRespostas);
    }
  };

  const proximaPergunta = () => {
    if (indicePergunta === 0) {
      if (faixaEtariaSelecionada !== null) {
        setIndicePergunta(indicePergunta + 1);
      }
    } else {
      if (respostas[indicePergunta - 1] !== -1) {
        if (indicePergunta < perguntas.length - 1) {
          setIndicePergunta(indicePergunta + 1);
        } else {
          calcularResultado();
        }
      }
    }
  };

  const voltarPergunta = () => {
    if (indicePergunta > 0) {
      setIndicePergunta(indicePergunta - 1);
    }
  };

  const calcularResultado = () => {
    const total = respostas.reduce((acc, val) => acc + (val + 1), 0);
    let grauCalculado;

    if (total <= 30) grauCalculado = resultadosGerais[0];
    else if (total <= 45) grauCalculado = resultadosGerais[1];
    else if (total <= 60) grauCalculado = resultadosGerais[2];
    else grauCalculado = resultadosGerais[3];

    setResultadoGrau(grauCalculado);
  };

  const getAlternativasAtuais = () => {
    return indicePergunta === 0 ? alternativasFaixaEtaria : alternativasQuestao;
  };

  const getRespostaAtual = () => {
    return indicePergunta === 0 ?
      (faixaEtariaSelecionada !== null ? alternativasFaixaEtaria.indexOf(faixaEtariaSelecionada) : -1) :
      respostas[indicePergunta - 1];
  }

  const goToPlanoDeAcao = () => {
    if (resultadoGrau && faixaEtariaSelecionada) {
      const encodedFaixaEtaria = encodeURIComponent(faixaEtariaSelecionada);
      navigate(`/plano-de-acao/${encodedFaixaEtaria}`, {
        state: {
          grau: resultadoGrau.grau
        }
      });
    }
  };

  return (
    <div className="questionario">
      {resultadoGrau ? (
        <div className="resultado">
          <h2>{resultadoGrau.grau}</h2>
          <p><strong>Descrição:</strong> {resultadoGrau.descricao}</p>
          <p><strong>Possíveis comportamentos:</strong></p>
          <ul>
            {resultadoGrau.comportamentos.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="frase-final">Confira sugestões de atividades mais completas para ajudar seu amigo ou familiar:</p>
          <button onClick={goToPlanoDeAcao}>Ver o Plano de Ação Personalizado</button>
        </div>
      ) : (
        <div>
          <h2>{perguntas[indicePergunta]}</h2>
          <div className="alternativas">
            {getAlternativasAtuais().map((alt, i) => (
              <label key={i} className={`alternativa ${getRespostaAtual() === i ? 'selecionada' : ''}`}>
                <input
                  type="radio"
                  value={i}
                  checked={getRespostaAtual() === i}
                  onChange={() => handleResposta(i)}
                />
                {alt}
              </label>
            ))}
          </div>
          <div className="botoes">
            <button onClick={voltarPergunta} disabled={indicePergunta === 0}>Voltar</button>
            <button
              onClick={proximaPergunta}
              disabled={
                indicePergunta === 0
                  ? faixaEtariaSelecionada === null
                  : respostas[indicePergunta - 1] === -1
              }
            >
              {indicePergunta === perguntas.length - 1 ? 'Finalizar' : 'Próximo'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questionario;
