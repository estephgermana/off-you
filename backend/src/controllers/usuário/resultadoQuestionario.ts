import { Request, Response } from 'express';
import knex from '../../connection';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Authenticator } from '../../services/midleware/Authenticator';

// Schema de validação
const schemaResultado = yup.object({
  grau: yup.string().required('Grau é obrigatório')
    .oneOf(['Uso saudável', 'Dependência leve', 'Dependência moderada', 'Dependência severa'], 'Grau inválido'),
  descricao: yup.string().required('Descrição é obrigatória'),
  pontuacao: yup.number().required('Pontuação é obrigatória').min(0).max(100),
});

// Função para calcular faixa etária
function calcularFaixaEtaria(dataNascimento: Date): string {
  const hoje = new Date();
  const idade = hoje.getFullYear() - dataNascimento.getFullYear();
  
  if (idade >= 0 && idade <= 4) return '0-4 anos';
  if (idade >= 5 && idade <= 9) return '5-9 anos';
  throw new Error('Faixa etária não suportada');
}

export const resultadoQuestionarioComPlano = async (req: Request, res: Response) => {
  try {
    // Validação dos dados
    await schemaResultado.validate(req.body, { abortEarly: false });

    // Autenticação
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const authenticator = new Authenticator();
    const payload = authenticator.getTokenData(token);

    if (!payload || !payload.id_usuario) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    const usuarioId = payload.id_usuario;

    // Verifica se já existe resposta
    const respostaExistente = await knex('resultados_questionario')
      .where({ usuario_id: usuarioId })
      .first();

    if (respostaExistente) {
      return res.status(400).json({ message: 'Você já respondeu o questionário.' });
    }

    // Busca dados do usuário
    const usuario = await knex('usuario')
      .where({ id_usuario: usuarioId })
      .select('data_nascimento_vitima')
      .first();

    if (!usuario || !usuario.data_nascimento_vitima) {
      return res.status(400).json({ message: 'Data de nascimento não cadastrada.' });
    }

    // Calcula faixa etária
    const faixaEtaria = calcularFaixaEtaria(new Date(usuario.data_nascimento_vitima));
    const { grau, descricao, pontuacao } = req.body;

    // Inicia transação
    const trx = await knex.transaction();

    try {
      // Salva resultado do questionário
      const id_resultado = uuidv4();
      await trx('resultados_questionario').insert({
        id_resultado,
        usuario_id: usuarioId,
        grau,
        descricao,
        pontuacao,
        data_resposta: knex.fn.now()
      });

      // Busca o plano correspondente
      const plano = await trx('tipo_plano_acad')
        .where({
          faixa_etaria: faixaEtaria,
          grau_dependencia: grau
        })
        .first();

      if (!plano) {
        throw new Error('Plano não encontrado para esta faixa etária e grau');
      }

      // Busca atividades do plano
      const atividades = await trx('attvidade')
        .where({ id_tipo_plano: plano.id_tipo_plano })
        .select('id_attvidade', 'titulo', 'descricao');

      // Commit da transação
      await trx.commit();

      // Resposta com plano e atividades
      res.status(201).json({
        message: 'Questionário salvo e plano atribuído com sucesso',
        plano: {
          id: plano.id_tipo_plano,
          titulo: plano.titulo,
          faixa_etaria: plano.faixa_etaria,
          grau_dependencia: plano.grau_dependencia
        },
        atividades
      });

    } catch (error) {
      await trx.rollback();
      throw error;
    }

  } catch (error: any) {
    console.error(error);

    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ 
        message: 'Erro de validação', 
        errors: error.errors 
      });
    }

    if (error.message === 'Faixa etária não suportada') {
      return res.status(400).json({ 
        message: 'A faixa etária calculada não é suportada pelo sistema' 
      });
    }

    if (error.message === 'Plano não encontrado para esta faixa etária e grau') {
      return res.status(404).json({ 
        message: 'Nenhum plano encontrado para a combinação de faixa etária e grau de dependência' 
      });
    }

    res.status(500).json({ 
      message: 'Erro inesperado ao processar questionário',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};