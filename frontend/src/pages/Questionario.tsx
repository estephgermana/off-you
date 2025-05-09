// src/pages/Questionario.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';


import '../styles/Questionario.css';

const perguntas = [
  "A pessoa fica irritada ou ansiosa quando não tem acesso à internet?",
  "A pessoa passa muito mais tempo online do que inicialmente planejava?",
  "A pessoa deixa de cumprir compromissos (trabalho, escola, tarefas) por estar conectada à internet?",
  "A pessoa parece precisar de mais tempo online para se sentir satisfeita?",
  "Você já percebeu que a pessoa tentou reduzir o tempo online e não conseguiu?",
  "A pessoa evita encontros familiares ou sociais para ficar conectada?",
  "A pessoa minimiza ou mente sobre o tempo que passa na internet?",
  "A pessoa recorre à internet quando está triste, ansiosa ou irritada?",
  "A pessoa mostra sinais de irritação, tristeza ou nervosismo quando está sem internet?",
  "O uso da internet está prejudicando o desempenho acadêmico, profissional ou social da pessoa?",
  "A pessoa parece perder a noção do tempo enquanto está online?",
  "A pessoa prefere interações online em vez de conversas presenciais?",
  "A pessoa sacrifica horas de sono para ficar conectada?",
  "A pessoa demonstra preocupação ou ansiedade excessiva quando não pode usar a internet?",
  "Você já presenciou a pessoa falhar repetidamente em controlar o tempo de conexão?"
];

const alternativas = ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"];

const resultados = [
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
  const [respostas, setRespostas] = useState<number[]>(new Array(perguntas.length).fill(-1));
  const [resultado, setResultado] = useState<null | typeof resultados[0]>(null);
  

  const handleResposta = (index: number) => {
    const novasRespostas = [...respostas];
    novasRespostas[indicePergunta] = index;
    setRespostas(novasRespostas);
  };

  const proximaPergunta = () => {
    if (respostas[indicePergunta] !== -1) {
      if (indicePergunta < perguntas.length - 1) {
        setIndicePergunta(indicePergunta + 1);
      } else {
        calcularResultado();
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
    let grau;
    if (total <= 30) grau = resultados[0];
    else if (total <= 45) grau = resultados[1];
    else if (total <= 60) grau = resultados[2];
    else grau = resultados[3];
    setResultado(grau);
  };

  return (
    <div className="questionario">
      {resultado ? (
        <div className="resultado">
          <h2>{resultado.grau}</h2>
          <p><strong>Descrição:</strong> {resultado.descricao}</p>
          <p><strong>Possíveis comportamentos:</strong></p>
          <ul>
            {resultado.comportamentos.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="frase-final">Confira sugestões de atividades mais completas para ajudar seu amigo ou familiar:</p>
          <Link to="/cadastro">
            <button>Cadastre-se para ver o Plano de Ação</button>
          </Link>


        </div>
      ) : (
        <div>
          <h2>{perguntas[indicePergunta]}</h2>
          <div className="alternativas">
            {alternativas.map((alt, i) => (
              <label key={i} className={`alternativa ${respostas[indicePergunta] === i ? 'selecionada' : ''}`}>
                <input
                  type="radio"
                  value={i}
                  checked={respostas[indicePergunta] === i}
                  onChange={() => handleResposta(i)}
                />
                {alt}
              </label>
            ))}
          </div>
          <div className="botoes">
            <button onClick={voltarPergunta} disabled={indicePergunta === 0}>Voltar</button>
            <button onClick={proximaPergunta} disabled={respostas[indicePergunta] === -1}>Próximo</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questionario;