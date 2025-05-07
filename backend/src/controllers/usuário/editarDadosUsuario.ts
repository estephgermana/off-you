import { Request, Response } from 'express';
import knex from '../../connection';

import * as yup from 'yup';

export const schemaEditarPerfil = yup.object({
  nome: yup.string().min(3, 'Nome muito curto.').optional(),
  email: yup.string().email('Email inválido.').optional(),
  data_nascimento: yup.date().optional()
});

export const editarDadosUsuario = async (req: Request, res: Response) => {
    try {
      const { id_usuario } = req.body.tokenData;
  
      await schemaEditarPerfil.validate(req.body, { abortEarly: false });
  
      const { nome, email, data_nascimento } = req.body;
  
      const usuarioAtual = await knex('usuario').where({ id_usuario }).first();
      if (!usuarioAtual) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
      if (email && email !== usuarioAtual.email) {
        const emailExistente = await knex('usuario')
          .where({ email })
          .andWhereNot({ id_usuario })
          .first();
  
        if (emailExistente) {
          return res.status(400).json({ message: 'Esse e-mail já está em uso por outro usuário.' });
        }
      }
  
      await knex('usuario')
        .where({ id_usuario })
        .update({
          nome: nome || usuarioAtual.nome,
          email: email || usuarioAtual.email,
          data_nascimento: data_nascimento || usuarioAtual.data_nascimento
        });
  
      const usuarioAtualizado = await knex('usuario')
        .select('nome', 'email', 'tipo_usuario', 'data_nascimento', 'data_cadastro')
        .where({ id_usuario })
        .first();
  
      res.status(200).json({
        message: 'Cadastro atualizado com sucesso.',
        usuario: usuarioAtualizado
      });
  
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
      }
  
      res.status(500).json({ message: 'Erro ao atualizar cadastro.' });
    }
  };