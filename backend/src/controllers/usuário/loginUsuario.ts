import { Request, Response } from 'express';
import knex from '../../connection';
import { Authenticator } from '../../services/midleware/Authenticator';
import { compare } from 'bcryptjs';

export const loginUsuario = async (req: Request, res: Response) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: "Por favor, preencha os campos 'email' e 'senha'" });
        }

        const usuario = await knex('usuario').where({ email }).first();

        if (!usuario) {
            return res.status(400).json({ message: 'Email não existe!' });
        }

        const passwordIsCorrect = await compare(senha, usuario.senha);

        if (!passwordIsCorrect) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const auth = new Authenticator();
        const token = auth.generateToken({ id_usuario: usuario.id_usuario, tipo: usuario.tipo });

        return res.status(200).json({message: "Login realizado", token });
    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ message: 'Ocorreu um erro inesperado ao tentar fazer login.' });
    }
};
