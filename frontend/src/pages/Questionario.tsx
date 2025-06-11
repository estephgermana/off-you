import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
const alternativasFaixaEtaria = ["0-4 anos", "5-9 anos"];

const resultadosGerais = [
  {
    grau: 'Uso saudável',
    descricao: 'A pessoa tem um relacionamento equilibrado com a internet...',
    comportamentos: [
      'Consegue alternar facilmente entre atividades online e offline.',
      'Não apresenta sinais de irritação quando está desconectada.',
      'Mantém interações sociais presenciais saudáveis.'
    ]
  },
  {
    grau: 'Dependência leve',
    descricao: 'Indica sinais iniciais de uso excessivo da internet...',
    comportamentos: [
      'Atrasos leves em tarefas ou compromissos.',
      'Preferência por atividades online em vez de presenciais...',
      'Pequena irritabilidade ao se desconectar.'
    ]
  },
  {
    grau: 'Dependência moderada',
    descricao: 'O uso da internet já está causando impactos perceptíveis...',
    comportamentos: [
      'Evita compromissos para ficar online.',
      'Irrita-se com facilidade quando não está conectado(a).',
      'Sono irregular e fadiga.',
      'Interações sociais começam a ser substituídas por virtuais.'
    ]
  },
  {
    grau: 'Dependência severa',
    descricao: 'A internet domina significativamente a rotina da pessoa...',
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
  const [faixaEtariaSelecionada, setFaixaEtariaSelecionada] = useState<string | null>(null);
  const [resultadoGrau, setResultadoGrau] = useState<typeof resultadosGerais[0] | null>(null);
  const [mensagemAPI, setMensagemAPI] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarResultado = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCarregando(false);
        return;
      }

      try {
        const res = await axios.get('https://off-you.onrender.com/v1/validar_resposta_questionario', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.jaRespondeu) {
          const resultadoBackend = resultadosGerais.find(r => r.grau === res.data.resultado.grau);
          setResultadoGrau(resultadoBackend ?? resultadosGerais[0]);
          setMensagemAPI('Você já respondeu este questionário. Novas respostas não serão salvas.');
        }
      } catch (err) {
        console.error('Erro ao verificar resultado:', err);
      } finally {
        setCarregando(false);
      }
    };

    verificarResultado();
  }, []);

  const handleResposta = (index: number) => {
    if (mensagemAPI) {
      alert('Você já respondeu o questionário. Novas respostas não serão salvas.');
      return;
    }

    if (indicePergunta === 0) {
      setFaixaEtariaSelecionada(alternativasFaixaEtaria[index]);
    } else {
      const novasRespostas = [...respostas];
      novasRespostas[indicePergunta] = index;
      setRespostas(novasRespostas);
    }
  };

  const proximaPergunta = () => {
    if (indicePergunta === 0 && faixaEtariaSelecionada === null) {
      alert('Por favor, selecione uma faixa etária.');
      return;
    }
    if (indicePergunta > 0 && respostas[indicePergunta] === -1) {
      alert('Por favor, selecione uma resposta.');
      return;
    }

    if (indicePergunta < perguntas.length - 1) {
      setIndicePergunta(indicePergunta + 1);
    } else {
      finalizarQuestionario();
    }
  };

  const voltarPergunta = () => {
    if (indicePergunta > 0) {
      setIndicePergunta(indicePergunta - 1);
    }
  };

  const calcularGrauLocal = (total: number) => {
    if (total <= 30) return resultadosGerais[0];
    if (total <= 45) return resultadosGerais[1];
    if (total <= 60) return resultadosGerais[2];
    return resultadosGerais[3];
  };

  const finalizarQuestionario = async () => {
    const respostasValidas = respostas.slice(1);
    const total = respostasValidas.reduce((acc, val) => acc + (val + 1), 0);
    const grauCalculado = calcularGrauLocal(total);
    const token = localStorage.getItem('token');

    if (!token) {
      localStorage.setItem('respostasPendentes', JSON.stringify({
        respostas: respostasValidas,
        pontuacao: total,
        grau: grauCalculado.grau,
        descricao: grauCalculado.descricao,
        faixa_etaria: faixaEtariaSelecionada
      }));
      setMensagemAPI('Suas respostas ainda não foram salvas. Cadastre-se para salvar e acessar o plano de ação.');
      setResultadoGrau(grauCalculado);
      return;
    }

    try {
      const res = await axios.post(
        'https://off-you.onrender.com/v1/resultado-questionario',
        {
          grau: grauCalculado.grau,
          descricao: grauCalculado.descricao,
          pontuacao: total,
          faixa_etaria_respondida: faixaEtariaSelecionada
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.message) setMensagemAPI(res.data.message);
      if (res.data.aviso) setMensagemAPI(res.data.aviso);
      setResultadoGrau(grauCalculado);
    } catch (err: any) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        console.error('Erro inesperado ao salvar resultado:', err);
      }
    }
  };

  const goToPlanoDeAcao = () => {
    if (resultadoGrau && faixaEtariaSelecionada) {
      navigate(`/plano-de-acao/${encodeURIComponent(faixaEtariaSelecionada)}`, {
        state: { grau: resultadoGrau.grau }
      });
    }
  };

  const getAlternativasAtuais = () =>
    indicePergunta === 0 ? alternativasFaixaEtaria : alternativasQuestao;

  const getRespostaAtual = () =>
    indicePergunta === 0
      ? faixaEtariaSelecionada !== null ? alternativasFaixaEtaria.indexOf(faixaEtariaSelecionada) : -1
      : respostas[indicePergunta];

  return (
    <div className="questionario">
      {mensagemAPI && (
        <div className="alerta">
          <strong>Atenção:</strong> {mensagemAPI}
        </div>
      )}

      {carregando ? (
        <p>Carregando...</p>
      ) : resultadoGrau ? (
        <div className="resultado">
          <h2>{resultadoGrau.grau}</h2>
          <p><strong>Descrição:</strong> {resultadoGrau.descricao}</p>
          <ul>
            {resultadoGrau.comportamentos.map((comportamento, index) => (
              <li key={index}>{comportamento}</li>
            ))}
          </ul>

          {localStorage.getItem('token') ? (
            <button onClick={goToPlanoDeAcao}>Ver o Plano de Ação Personalizado</button>
          ) : (
            <>
              <p style={{ color: 'red', marginTop: '1rem' }}>
                <strong>Aviso:</strong> Suas respostas ainda <u>não foram salvas</u>. Cadastre-se para salvá-las e acessar o Plano de Ação.
              </p>
              <Link to="/cadastro">
                <button>Fazer Cadastro</button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="pergunta">
          <h3>{perguntas[indicePergunta]}</h3>
          <div className="alternativas">
            {getAlternativasAtuais().map((alternativa, index) => (
              <button
                key={index}
                className={getRespostaAtual() === index ? 'selecionada' : ''}
                onClick={() => handleResposta(index)}
              >
                {alternativa}
              </button>
            ))}
          </div>
          <div className="navegacao">
            {indicePergunta > 0 && <button onClick={voltarPergunta}>Voltar</button>}
            <button onClick={proximaPergunta}>Próxima</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questionario;
