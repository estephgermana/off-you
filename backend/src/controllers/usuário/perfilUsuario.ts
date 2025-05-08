import { Request, Response } from 'express';
import knex from '../../connection';

export const perfilUsuario = async (req: Request, res: Response) => {
  try {
    const { id_usuario } = req.body.tokenData;

    const usuario = await knex('usuario')
      .select('nome', 'email', 'tipo_usuario', 'data_nascimento', 'data_cadastro')
      .where({ id_usuario })
      .first();

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json({ usuario });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar perfil.' });
  }
};
