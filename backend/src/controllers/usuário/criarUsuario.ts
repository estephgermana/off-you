import { Request, Response } from 'express';
import knex from '../../connection';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';

import { Authenticator, HashManager } from '../../services/midleware/Authenticator';

const schemaCadastro = yup.object({
    nome: yup.string().min(3, 'Nome muito curto.').required('Nome é obrigatório.'),
    email: yup.string().email('Formato de email inválido.').required('Email é obrigatório.'),
    senha: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres.').required('Senha é obrigatória.'),
    tipo_usuario: yup.string().required('Tipo é obrigatório.'),
    data_nascimento: yup.date().required('Data de nascimento é obrigatória.'),
  });

export const criarUsuario = async (req: Request, res: Response) => {
    try {
        // Validando os dados de entrada
        await schemaCadastro.validate(req.body, { abortEarly: false });
    
        const { nome, email, senha, tipo_usuario, data_nascimento } = req.body;
    
        // Verificando se o email já está cadastrado
        const usuarioExistente = await knex('usuario').where({ email }).first();
        if (usuarioExistente) {
          // Envia resposta diretamente, sem retornar explicitamente o Response
          return res.status(400).json({ message: 'Já existe um usuário cadastrado com esse email.' });
        }
    
        const idUsuario = uuidv4();
    
        // Criptografando a senha
        const hashManager = new HashManager();
        const senhaHash = await hashManager.hash(senha);
    
        // Inserindo o usuário no banco de dados dentro de uma transação
        await knex.transaction(async (trx) => {
          await trx('usuario').insert({
            id_usuario: idUsuario,
            nome,
            email,
            senha: senhaHash,
            tipo_usuario,
            data_cadastro: new Date(),
            data_nascimento,
          });
        });
    
        // Gerando o token de autenticação
        const auth = new Authenticator();
        const token = auth.generateToken({
          id_usuario: idUsuario,
          tipo: tipo_usuario,
        });
    
        // Enviando a resposta de sucesso
        res.status(201).json({ message: 'Usuário cadastrado com sucesso.', token });
    
      } catch (error: any) {
        console.error(error);
    
        if (error instanceof yup.ValidationError) {
          // Enviando erros de validação, sem retornar Response explicitamente
          return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
        }
    
        // Enviando erro inesperado
        res.status(500).json({ message: 'Erro inesperado ao cadastrar o usuário.' });
    }
};
