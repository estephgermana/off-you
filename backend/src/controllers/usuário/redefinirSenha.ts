import { Request, Response } from 'express';
import knex from '../../connection';
import * as yup from 'yup';
import { Authenticator, HashManager } from '../../services/midleware/Authenticator';

const schemaRedefinir = yup.object({
  senha: yup.string().min(6).required(),
  token: yup.string().required(),
});

export const redefinirSenha = async (req: Request, res: Response) => {
  try {
    await schemaRedefinir.validate(req.body, { abortEarly: false });

    const { senha, token } = req.body;

    const auth = new Authenticator();
    const tokenData = auth.getTokenData(token);

    const usuario = await knex('usuario')
      .where({ id_usuario: tokenData.id_usuario })
      .first();

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const hashManager = new HashManager();
    const senhaHash = await hashManager.hash(senha);

    await knex('usuario')
      .where({ id_usuario: tokenData.id_usuario })
      .update({ senha: senhaHash });

    res.status(200).json({ message: 'Senha redefinida com sucesso.' });

  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }

    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
    }

    res.status(500).json({ message: 'Erro ao redefinir a senha.' });
  }
};
