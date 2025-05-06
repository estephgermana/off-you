import { Request, Response } from 'express';
import knex from '../../connection';
import { Authenticator, HashManager } from '../../services/midleware/Authenticator';
import * as yup from 'yup';

// Validação do schema para o login
const schemaLogin = yup.object({
  email: yup.string().email('Formato de email inválido.').required('Email é obrigatório.'),
  senha: yup.string().required('Senha é obrigatória.'),
});

export const loginUsuario = async (req: Request, res: Response) => {
  try {
    await schemaLogin.validate(req.body, { abortEarly: false });

    const { email, senha } = req.body;

    const usuario = await knex('usuario').where({ email }).first();
    if (!usuario) {
      return res.status(400).json({ message: 'Usuário ou senha inválidos.' });
    }

    const hashManager = new HashManager();
    const senhaValida = await hashManager.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json({ message: 'Usuário ou senha inválidos.' });
    }

    const auth = new Authenticator();
    const token = auth.generateToken({
      id_usuario: usuario.id_usuario,
      tipo: usuario.tipo_usuario,
    });

    res.status(200).json({ message: 'Login realizado com sucesso.', token });

  } catch (error: any) {
    console.error(error);

    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
    }

    res.status(500).json({ message: 'Erro inesperado ao realizar login.' });
  }
};
