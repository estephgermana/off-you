import { Request, Response } from 'express';
import knex from '../../src/connection'; 
import { v4 as uuidv4 } from 'uuid';
import { Authenticator, HashManager } from '../../src/services/midleware/Authenticator';
import * as yup from 'yup'; 

const schemaCadastro = yup.object().shape({
    nome: yup.string().min(3, 'Nome muito curto.').required('Nome é obrigatório.'),
    email: yup.string().email('Formato de email inválido.').required('Email é obrigatório.'),
    senha: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres.').required('Senha é obrigatória.'),
    tipo_usuario: yup.string().oneOf(['', 'user'], 'Tipo de usuário inválido.').required('Tipo de usuário é obrigatório.'),
    data_nascimento: yup.date().required('Data de nascimento é obrigatória.'),
});

export const criarUsuario = async (req: Request, res: Response) => {
    try {
        // Valida os dados de entrada com o Yup
        await schemaCadastro.validate(req.body, { abortEarly: false });

        const {
            nome,
            email,
            senha,
            tipo_usuario,
            data_nascimento
        } = req.body;

        // Verificar se o email já está cadastrado
        const usuarioExistente = await knex('usuario').where('email', email).first();
        if (usuarioExistente) {
            return res.status(400).json({ message: 'Já existe um usuário cadastrado com esse email.' });
        }

        // Gerar UUID para o novo usuário
        const idUsuario = uuidv4();

        // Criptografando a senha
        const cypherPassword = new HashManager();
        const senhaHash = await cypherPassword.hash(senha);

        // Iniciando a transação no banco de dados para garantir integridade dos dados
        await knex.transaction(async (trx) => {
            // Inserir o novo usuário
            await trx('usuario').insert({
                id_usuario: idUsuario,
                nome,
                email,
                senha: senhaHash,
                tipo_usuario,
                data_cadastro: new Date(),
                data_nascimento
            });
        });

        // Gerar o token de autenticação para o usuário
        const auth = new Authenticator();
        const token = auth.generateToken({ id_usuario: idUsuario, tipo_usuario });

        // Retornar resposta de sucesso com token
        res.status(201).json({ message: 'Usuário cadastrado com sucesso.', token });
    } catch (error) {
        console.error(error);

        // Se houver erros de validação de dados
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
        }

        // Caso ocorra algum erro inesperado
        res.status(500).send('Erro inesperado ao cadastrar o usuário.');
    }
};
