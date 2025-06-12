import { Request, Response } from 'express';
import knex from '../../connection';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Authenticator } from '../../services/midleware/Authenticator';

const schemaResultado = yup.object({
  grau: yup.string().required('Grau é obrigatório')
    .oneOf(['Uso saudável', 'Dependência leve', 'Dependência moderada', 'Dependência severa'], 'Grau inválido'),
  descricao: yup.string().required('Descrição é obrigatória'),
  pontuacao: yup.number().required('Pontuação é obrigatória').min(0).max(100),
  faixa_etaria: yup.string()
    .required('Faixa etária respondida é obrigatória')
    .oneOf(['0-4 anos', '5-9 anos'], 'Faixa etária inválida'),
});


function calcularFaixaEtaria(dataNascimento: Date): string {
  const hoje = new Date();
  const idade = hoje.getFullYear() - dataNascimento.getFullYear();

  if (idade >= 0 && idade <= 4) return '0-4 anos';
  if (idade >= 5 && idade <= 9) return '5-9 anos';
  throw new Error('Faixa etária não suportada');
}

export const resultadoQuestionarioComPlano = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    const authenticator = new Authenticator();
    const payload = authenticator.getTokenData(token);
    if (!payload || !payload.id_usuario) return res.status(401).json({ message: 'Token inválido' });

    const usuarioId = payload.id_usuario;

    const respostaAnterior = await knex('resultados_questionario')
      .where({ usuario_id: usuarioId })
      .orderBy('data_resposta', 'desc')
      .first();

    if (respostaAnterior) {
      const atividadesPendentes = await knex('diario_atividade')
        .where({ id_usuario: usuarioId })
        .andWhere('feita', false)
        .andWhere('id_plano', knex.raw('(SELECT id_plano FROM diario_atividade WHERE id_usuario = ? ORDER BY data_registro DESC LIMIT 1)', [usuarioId]));

      if (atividadesPendentes.length > 0) {
        return res.status(400).json({ 
          message: 'Você já respondeu o questionário e ainda possui atividades pendentes do plano atual.' 
        });
      }
    }

    const usuario = await knex('usuario')
      .where({ id_usuario: usuarioId })
      .select('data_nascimento_vitima')
      .first();

    if (!usuario || !usuario.data_nascimento_vitima) {
      return res.status(400).json({ message: 'Data de nascimento não cadastrada.' });
    }

    const faixaEtariaCalculada = calcularFaixaEtaria(new Date(usuario.data_nascimento_vitima));

    req.body.faixa_etaria = faixaEtariaCalculada;

    const { grau, descricao, pontuacao, faixa_etaria } = req.body;

    let aviso: string | undefined;
    if (faixaEtariaCalculada !== faixa_etaria) {
      aviso = 'A faixa etária informada nas respostas difere da calculada com a data de nascimento. Os dados foram salvos, mas recomendamos revisar as informações.';
    }

    await schemaResultado.validate(req.body, { abortEarly: false });

    const trx = await knex.transaction();

    try {
      const id_resultado = uuidv4();
      await trx('resultados_questionario').insert({
        id_resultado,
        usuario_id: usuarioId,
        grau,
        descricao,
        pontuacao,
        faixa_etaria,
        data_resposta: knex.fn.now()
      });

      const plano = await trx('tipo_plano_acao')
        .where({ faixa_etaria: faixa_etaria, grau_dependencia: grau })
        .first();

      if (!plano) throw new Error('Plano não encontrado para esta faixa etária e grau');

      const atividades = await trx('atividade')
        .where({ id_tipo_plano: plano.id_tipo_plano })
        .select('id_atividade', 'titulo', 'descricao');

      const registrosDiario = atividades.map(atividade => ({
        id_diario: uuidv4(),
        id_plano: plano.id_tipo_plano,
        id_atividade: atividade.id_atividade,
        id_usuario: usuarioId,
        comentario: null,
        data_registro: knex.fn.now(),
        avaliacao: null,
        feita: false
      }));

      await trx('diario_atividade').insert(registrosDiario);

      await trx.commit();

      res.status(201).json({
        message: 'Questionário salvo, plano atribuído e diário criado com sucesso',
        plano: {
          id: plano.id_tipo_plano,
          titulo: plano.titulo,
          faixa_etaria: plano.faixa_etaria,
          grau_dependencia: plano.grau_dependencia
        },
        atividades,
        ...(aviso && { aviso })
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
