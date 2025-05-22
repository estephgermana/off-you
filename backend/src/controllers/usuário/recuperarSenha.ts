import { Request, Response } from 'express';
import knex from '../../connection';
import { Authenticator } from '../../services/midleware/Authenticator';
import * as yup from 'yup';
import nodemailer from 'nodemailer';

const schemaEmail = yup.object({
  email: yup.string().email().required(),
});

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e51df9f883856e",
    pass: "a645257fe7f307"
  }
});

export const recuperarSenhaUsuario = async (req: Request, res: Response) => {
  try {
    await schemaEmail.validate(req.body, { abortEarly: false });

    const { email } = req.body;

    const usuario = await knex('usuario').where({ email }).first();

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const auth = new Authenticator();
    const tokenRecuperacao = auth.generateToken({
      id_usuario: usuario.id_usuario,
      tipo: usuario.tipo_usuario,
    }, '15m');

    
    const linkRecuperacao = `http://localhost:3000/redefinir-senha?token=${tokenRecuperacao}`;

    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperação de Senha',
      text: `Clique no link para redefinir sua senha: ${linkRecuperacao}`,
    };

    await transport.sendMail(mailOptions);

    res.status(200).json({
      message: 'Token de recuperação gerado e enviado por e-mail.',
    });
  } catch (error: any) {
    console.error(error);
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
    }

    res.status(500).json({ message: 'Erro ao processar solicitação de recuperação de senha.' });
  }
};
