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
  // O array de respostas terá o tamanho total de perguntas (incluindo a de faixa etária)
  // O índice da faixa etária (0) será ignorado no cálculo de pontuação, mas a resposta será usada.
  const [respostas, setRespostas] = useState<number[]>(new Array(perguntas.length).fill(-1));
  const [faixaEtariaSelecionada, setFaixaEtariaSelecionada] = useState<string | null>(null);
  const [resultadoGrau, setResultadoGrau] = useState<typeof resultadosGerais[0] | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [jaRespondeuAlerta, setJaRespondeuAlerta] = useState(false);
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
          setResultadoGrau({
            grau: res.data.resultado.grau,
            descricao: res.data.resultado.descricao,
            comportamentos: [] // Assumindo que você não está pegando comportamentos do backend aqui
          });
          setJaRespondeuAlerta(true);
        }
      } catch (err) {
        console.error('Erro ao buscar resultado:', err);
      } finally {
        setCarregando(false);
      }
    };

    verificarResultado();
  }, []);

  const handleResposta = (index: number) => {
    if (jaRespondeuAlerta) {
      alert('Você já respondeu o questionário. Novas respostas não serão salvas.');
      return;
    }

    if (indicePergunta === 0) { // Lógica para a primeira pergunta (faixa etária)
      setFaixaEtariaSelecionada(alternativasFaixaEtaria[index]);
    } else {
      const novasRespostas = [...respostas];
      novasRespostas[indicePergunta] = index; // Armazena a resposta no índice da pergunta
      setRespostas(novasRespostas);
    }
  };

  const proximaPergunta = () => {
    if (jaRespondeuAlerta) {
      alert('Você já respondeu o questionário. Novas respostas não serão salvas.');
      return;
    }

    // Validação para a primeira pergunta (faixa etária)
    if (indicePergunta === 0) {
      if (faixaEtariaSelecionada !== null) {
        setIndicePergunta(indicePergunta + 1);
      } else {
        alert('Por favor, selecione uma faixa etária para continuar.');
      }
      return;
    }

    // Validação para as demais perguntas
    if (respostas[indicePergunta] !== -1) { // Verifique a resposta da pergunta atual
      if (indicePergunta < perguntas.length - 1) {
        setIndicePergunta(indicePergunta + 1);
      } else {
        finalizarQuestionario(); // Chama a função que envia para o backend
      }
    } else {
      alert('Por favor, selecione uma resposta para continuar.');
    }
  };

  const voltarPergunta = () => {
    if (indicePergunta > 0) {
      setIndicePergunta(indicePergunta - 1);
    }
  };

  // Função para calcular o grau localmente (apenas para exibição e antes de enviar)
  const calcularGrauLocal = (total: number) => {
    let grauCalculado;
    if (total <= 30) grauCalculado = resultadosGerais[0];
    else if (total <= 45) grauCalculado = resultadosGerais[1];
    else if (total <= 60) grauCalculado = resultadosGerais[2];
    else grauCalculado = resultadosGerais[3];
    return grauCalculado;
  };

  const finalizarQuestionario = async () => {
    // Calcula a pontuação ignorando a primeira pergunta (faixa etária)
    const pontuacaoRespostas = respostas.slice(1); // Pega as respostas a partir do índice 1
    const total = pontuacaoRespostas.reduce((acc, val) => acc + (val + 1), 0);
    
    const grauCalculado = calcularGrauLocal(total);
    setResultadoGrau(grauCalculado); // Define o resultado no estado para exibição

    const token = localStorage.getItem('token');

    if (!token) {
      // Se não houver token, salva as respostas pendentes no localStorage e redireciona para cadastro
      localStorage.setItem('respostasPendentes', JSON.stringify({
        respostas: respostas.slice(1), // Salva apenas as respostas das questões
        pontuacao: total,
        grau: grauCalculado.grau,
        descricao: grauCalculado.descricao,
        faixa_etaria: faixaEtariaSelecionada // Salva a faixa etária também
      }));
      navigate('/cadastro');
    } else {
      // Se houver token, envia o resultado para o backend
      await enviarResultado(token, grauCalculado, total, faixaEtariaSelecionada);
    }
  };

  const enviarResultado = async (
    token: string,
    grauSelecionado: typeof resultadosGerais[0],
    total: number,
    faixaEtaria: string | null
  ) => {
    try {
      await axios.post(
        'https://off-you.onrender.com/v1/resultado-questionario',
        {
          grau: grauSelecionado.grau,
          descricao: grauSelecionado.descricao,
          pontuacao: total,
          faixa_etaria: faixaEtaria // Incluindo a faixa etária aqui
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Resultado do questionário salvo no backend!');
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
    }
  };

  const getAlternativasAtuais = () => {
    return indicePergunta === 0 ? alternativasFaixaEtaria : alternativasQuestao;
  };

  const getRespostaAtual = () => {
    return indicePergunta === 0 ?
      (faixaEtariaSelecionada !== null ? alternativasFaixaEtaria.indexOf(faixaEtariaSelecionada) : -1) :
      respostas[indicePergunta]; // Pega a resposta do array `respostas` no índice da pergunta atual
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
      {jaRespondeuAlerta && (
        <div style={{ backgroundColor: '#ffdddd', padding: '10px', marginBottom: '15px', border: '1px solid red', borderRadius: '5px' }}>
          <strong>Atenção:</strong> Você já respondeu este questionário. Novas respostas não serão salvas.
        </div>
      )}

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
          {localStorage.getItem('token') ? ( // Se já tiver token, vai pro plano de ação
            <button onClick={goToPlanoDeAcao}>Ver o Plano de Ação Personalizado</button>
          ) : ( // Se não tiver token, pede pra cadastrar
            <Link to="/cadastro">
              <button>Cadastre-se para ver o Plano de Ação</button>
            </Link>
          )}
        </div>
      ) : carregando ? (
        <p>Carregando...</p>
      ) : (
        <div>
          <h2>{perguntas[indicePergunta]}</h2>
          <div className="alternativas">
            {getAlternativasAtuais().map((alt, i) => (
              <label
                key={i}
                className={`alternativa ${getRespostaAtual() === i ? 'selecionada' : ''}`}
              >
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
                  : respostas[indicePergunta] === -1 // Verifique a resposta da pergunta atual
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