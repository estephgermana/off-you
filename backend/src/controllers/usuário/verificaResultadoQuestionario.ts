import { Request, Response } from 'express';
import knex from '../../connection';
import { Authenticator } from '../../services/midleware/Authenticator';

export const verificarResultadoQuestionario = async (req: Request, res: Response) => {
  try {
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

    const resultado = await knex('resultados_questionario')
      .where({ usuario_id: usuarioId })
      .orderBy('data_resposta', 'desc')
      .first();

    if (resultado) {
      const atividadesPendentes = await knex('diario_atividade')
        .where({ id_usuario: usuarioId, feita: false })
        .andWhere('id_plano', knex.raw('(SELECT id_plano FROM diario_atividade WHERE id_usuario = ? ORDER BY data_registro DESC LIMIT 1)', [usuarioId]));

      const temPendencias = atividadesPendentes.length > 0;

      return res.json({
        jaRespondeu: true,
        temPendencias,
        resultado: {
          grau: resultado.grau,
          descricao: resultado.descricao,
          pontuacao: resultado.pontuacao
        }
      });
    }

    res.json({ jaRespondeu: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao verificar resultado do questionário.' });
  }
};

