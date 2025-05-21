import { Request, Response } from 'express';
import knex from '../../connection';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';

import { Authenticator, HashManager } from '../../services/midleware/Authenticator';

const schemaCadastro = yup.object({
    nome: yup.string().min(3, 'Nome muito curto.').required('Nome é obrigatório.'),
    email: yup.string().email('Formato de email inválido.').required('Email é obrigatório.'),
    senha: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres.').required('Senha é obrigatória.'),
    tipo_usuario: yup.string().default('familiar'),
    data_nascimento: yup.date().required('Data de nascimento é obrigatória.'),
  });

export const criarUsuario = async (req: Request, res: Response) => {
    try {
        await schemaCadastro.validate(req.body, { abortEarly: false });
    
        const { nome, email, senha, data_nascimento, nivel_proximidade } = req.body;
    
        const usuarioExistente = await knex('usuario').where({ email }).first();
        if (usuarioExistente) {
          return res.status(400).json({ message: 'Já existe um usuário cadastrado com esse email.' });
        }
    
        const idUsuario = uuidv4();
    
        const hashManager = new HashManager();
        const senhaHash = await hashManager.hash(senha);
        const tipo_usuario = "familiar";
    
        await knex.transaction(async (trx) => {
          await trx('usuario').insert({
            id_usuario: idUsuario,
            nome,
            email,
            senha: senhaHash,
            tipo_usuario: tipo_usuario,
            data_cadastro: new Date(),
            data_nascimento,
            nivel_proximidade
          });
        });
    
        const auth = new Authenticator();
        const token = auth.generateToken({
          id_usuario: idUsuario,
          tipo: tipo_usuario,
        });
    
        res.status(201).json({ message: 'Usuário cadastrado com sucesso.', token });
    
      } catch (error: any) {
        console.error(error);
    
        if (error instanceof yup.ValidationError) {
          return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
        }
    
        res.status(500).json({ message: 'Erro inesperado ao cadastrar o usuário.' });
    }
};
