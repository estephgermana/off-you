// src/pages/Questionario.tsx
import React, { useState } from 'react';
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
  
  const Questionario: React.FC = () => {
    const [indicePergunta, setIndicePergunta] = useState(0);
    const [respostas, setRespostas] = useState<number[]>(new Array(perguntas.length).fill(-1)); // -1 significa sem resposta
    const [mensagemFinal, setMensagemFinal] = useState<string | null>(null);
  
    const handleResposta = (index: number) => {
      const newRespostas = [...respostas];
      newRespostas[indicePergunta] = index;
      setRespostas(newRespostas);
    };
  
    const proximaPergunta = () => {
      if (respostas[indicePergunta] !== -1) {
        if (indicePergunta < perguntas.length - 1) {
          setIndicePergunta(indicePergunta + 1);
        } else {
          calcularPontuacao();
        }
      }
    };
  
    const voltarPergunta = () => {
      if (indicePergunta > 0) {
        setIndicePergunta(indicePergunta - 1);
      }
    };
  
    const calcularPontuacao = () => {
      const pontuacao = respostas.reduce((acc, resposta) => acc + (resposta + 1), 0);
      let resultado = '';
      if (pontuacao <= 30) resultado = 'Uso saudável (sem dependência)';
      else if (pontuacao <= 45) resultado = 'Dependência leve';
      else if (pontuacao <= 60) resultado = 'Dependência moderada';
      else resultado = 'Dependência severa';
      setMensagemFinal(`Sua pontuação foi: ${pontuacao} - ${resultado}`);
    };
  
    return (
      <div className="questionario">
        {mensagemFinal ? (
          <div className="resultado">
            <h2>{mensagemFinal}</h2>
          </div>
        ) : (
          <div>
            <h2>{perguntas[indicePergunta]}</h2>
            <div className="alternativas">
              {alternativas.map((alternativa, index) => (
                <label key={index} className={`alternativa ${respostas[indicePergunta] === index ? 'selecionada' : ''}`}>
                  <input
                    type="radio"
                    name={`pergunta-${indicePergunta}`}
                    value={index}
                    checked={respostas[indicePergunta] === index}
                    onChange={() => handleResposta(index)}
                  />
                  {alternativa}
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