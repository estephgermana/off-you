import { Request, Response } from 'express';
import knex from '../../connection';

export const obterPlanoUsuario = async (req: Request, res: Response) => {
  try {
    const { id_usuario } = req.body.tokenData;

    const plano = await knex('plano_de_acao')
      .where({ id_usuario })
      .orderBy('data_inicio', 'desc')
      .first();

    if (!plano) {
      return res.status(404).json({ message: 'Nenhum plano encontrado para este usuário.' });
    }

    const tipoPlano = await knex('tipo_plano_acao')
      .where({ id_tipo_plano: plano.id_tipo_plano })
      .first();

    res.status(200).json({
      plano: {
        id_plano: plano.id_plano,
        data_inicio: plano.data_inicio,
        data_fim: plano.data_fim,
        tipo_plano: {
          id_tipo_plano: tipoPlano.id_tipo_plano,
          titulo: tipoPlano.titulo,
          descricao: tipoPlano.descricao,
          faixa_etaria: tipoPlano.faixa_etaria,
          grau_dependencia: tipoPlano.grau_dependencia,
        }
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar o plano do usuário.' });
  }
};
