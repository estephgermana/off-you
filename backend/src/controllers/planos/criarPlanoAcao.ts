import { Request, Response } from 'express';
import knex from '../../connection';

export const criarPlanoAcao = async (req: Request, res: Response) => {
  try {
    const { id_usuario } = req.body.tokenData; 
    const { id_tipo_plano, data_inicio, data_fim } = req.body;

    if (!id_tipo_plano || !data_inicio || !data_fim) {
      return res.status(400).json({ message: 'Parâmetros obrigatórios ausentes.' });
    }

    const tipoPlano = await knex('tipo_plano_acao').where({ id_tipo_plano }).first();
    if (!tipoPlano) {
      return res.status(404).json({ message: 'Tipo de plano não encontrado.' });
    }

    const [id_plano] = await knex('plano_de_acao').insert({
      id_usuario,
      id_tipo_plano,
      data_inicio,
      data_fim,
      criado_em: new Date(),
    }).returning('id_plano');

    res.status(201).json({
      message: 'Plano de ação criado com sucesso.',
      plano: {
        id_plano,
        id_usuario,
        id_tipo_plano,
        data_inicio,
        data_fim,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar plano de ação.' });
  }
};
