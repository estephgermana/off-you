"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarUsuario = void 0;
const connection_1 = __importDefault(require("../../connection"));
const uuid_1 = require("uuid");
const yup = __importStar(require("yup"));
const Authenticator_1 = require("../../services/midleware/Authenticator");
const schemaCadastro = yup.object({
    nome: yup.string().min(3, 'Nome muito curto.').required('Nome é obrigatório.'),
    email: yup.string().email('Formato de email inválido.').required('Email é obrigatório.'),
    senha: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres.').required('Senha é obrigatória.'),
    tipo_usuario: yup.string().default('familiar'),
    data_nascimento_vitima: yup.date().required('Data de nascimento é obrigatória.'),
});
const criarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield schemaCadastro.validate(req.body, { abortEarly: false });
        const { nome, email, senha, data_nascimento_vitima, nivel_proximidade } = req.body;
        const usuarioExistente = yield (0, connection_1.default)('usuario').where({ email }).first();
        if (usuarioExistente) {
            return res.status(400).json({ message: 'Já existe um usuário cadastrado com esse email.' });
        }
        const idUsuario = (0, uuid_1.v4)();
        const hashManager = new Authenticator_1.HashManager();
        const senhaHash = yield hashManager.hash(senha);
        const tipo_usuario = "familiar";
        yield connection_1.default.transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            yield trx('usuario').insert({
                id_usuario: idUsuario,
                nome,
                email,
                senha: senhaHash,
                tipo_usuario: tipo_usuario,
                data_cadastro: new Date(),
                data_nascimento_vitima,
                nivel_proximidade
            });
        }));
        const auth = new Authenticator_1.Authenticator();
        const token = auth.generateToken({
            id_usuario: idUsuario,
            tipo: tipo_usuario,
        });
        res.status(201).json({ message: 'Usuário cadastrado com sucesso.', token });
    }
    catch (error) {
        console.error(error);
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
        }
        res.status(500).json({ message: 'Erro inesperado ao cadastrar o usuário.' });
    }
});
exports.criarUsuario = criarUsuario;
//# sourceMappingURL=criarUsuario.js.map