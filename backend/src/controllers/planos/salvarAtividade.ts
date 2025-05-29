import { Request, Response } from 'express';
import knex from '../../connection';

export const salvarAtividadeDiario = async (req: Request, res: Response) => {
  try {
    // Pega os dados do token já validados no middleware
    const tokenData = req.body.tokenData;
    if (!tokenData || !tokenData.id_usuario) {
      return res.status(401).json({ message: 'Token inválido ou dados do usuário não encontrados' });
    }

    const usuarioId = tokenData.id_usuario;
    const { id_atividade, id_plano, feita, comentario, avaliacao } = req.body;

    if (
      id_atividade == null ||
      id_plano == null ||
      feita == null
    ) {
      return res.status(400).json({ message: 'Parâmetros insuficientes' });
    }

    // Verifica se já existe registro para essa atividade do usuário
    const registroExistente = await knex('diario_atividade')
      .where({ id_usuario: usuarioId, id_atividade, id_plano })
      .first();

    if (registroExistente) {
      // Atualiza registro existente
      await knex('diario_atividade')
        .where({ id_usuario: usuarioId, id_atividade, id_plano })
        .update({
          feita,
          comentario: comentario || null,
          avaliacao: avaliacao || null,
          data_registro: knex.fn.now(),
        });
    } else {
      // Insere novo registro
      await knex('diario_atividade').insert({
        id_usuario: usuarioId,
        id_atividade,
        id_plano,
        feita,
        comentario: comentario || null,
        avaliacao: avaliacao || null,
        data_registro: knex.fn.now(),
      });
    }

    return res.status(200).json({ message: 'Atividade salva no diário com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao salvar atividade no diário.' });
  }
};
