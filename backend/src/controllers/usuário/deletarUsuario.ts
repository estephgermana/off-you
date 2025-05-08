import { Request, Response } from 'express';
import knex from '../../connection';

export const deletarUsuario = async (req: Request, res: Response) => {
  try {
    const { id_usuario } = req.body.tokenData;

    const usuarioExistente = await knex('usuario').where({ id_usuario }).first();
    if (!usuarioExistente) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    await knex('usuario').where({ id_usuario }).delete();

    res.status(200).json({ message: 'Conta deletada com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário.' });
  }
};
