import { Request, Response } from 'express';
import knex from '../../connection';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Authenticator } from '../../services/midleware/Authenticator';

const schemaResultado = yup.object({
  grau: yup.string().required('Grau é obrigatório'),
  descricao: yup.string().required('Descrição é obrigatória'),
  pontuacao: yup.number().required('Pontuação é obrigatória'),
  data: yup.date().notRequired(),
});

export const resultadoQuestionario = async (req: Request, res: Response) => {
  try {
    await schemaResultado.validate(req.body, { abortEarly: false });

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

    // 🔒 Verifica se já existe resposta
    const respostaExistente = await knex('resultados_questionario')
      .where({ usuario_id: usuarioId })
      .first();

    if (respostaExistente) {
      return res.status(400).json({ message: 'Você já respondeu o questionário.' });
    }

    // ✅ Insere nova resposta
    const { grau, descricao, pontuacao } = req.body;
    const id_resultado = uuidv4();

    await knex('resultados_questionario').insert({
      id_resultado,
      usuario_id: usuarioId,
      grau,
      descricao,
      pontuacao
    });

    res.status(201).json({ message: 'Resultado salvo com sucesso.' });
  } catch (error: any) {
    console.error(error);

    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
    }

    res.status(500).json({ message: 'Erro inesperado ao salvar resultado.' });
  }
};
