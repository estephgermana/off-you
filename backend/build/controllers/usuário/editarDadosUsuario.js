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
exports.editarDadosUsuario = exports.schemaEditarPerfil = void 0;
const connection_1 = __importDefault(require("../../connection"));
const yup = __importStar(require("yup"));
exports.schemaEditarPerfil = yup.object({
    nome: yup.string().min(3, 'Nome muito curto.').optional(),
    email: yup.string().email('Email inválido.').optional(),
    data_nascimento: yup.date().optional()
});
const editarDadosUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_usuario } = req.body.tokenData;
        yield exports.schemaEditarPerfil.validate(req.body, { abortEarly: false });
        const { nome, email, data_nascimento } = req.body;
        const usuarioAtual = yield (0, connection_1.default)('usuario').where({ id_usuario }).first();
        if (!usuarioAtual) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        if (email && email !== usuarioAtual.email) {
            const emailExistente = yield (0, connection_1.default)('usuario')
                .where({ email })
                .andWhereNot({ id_usuario })
                .first();
            if (emailExistente) {
                return res.status(400).json({ message: 'Esse e-mail já está em uso por outro usuário.' });
            }
        }
        yield (0, connection_1.default)('usuario')
            .where({ id_usuario })
            .update({
            nome: nome || usuarioAtual.nome,
            email: email || usuarioAtual.email,
            data_nascimento: data_nascimento || usuarioAtual.data_nascimento
        });
        const usuarioAtualizado = yield (0, connection_1.default)('usuario')
            .select('nome', 'email', 'tipo_usuario', 'data_nascimento', 'data_cadastro')
            .where({ id_usuario })
            .first();
        res.status(200).json({
            message: 'Cadastro atualizado com sucesso.',
            usuario: usuarioAtualizado
        });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
        }
        res.status(500).json({ message: 'Erro ao atualizar cadastro.' });
    }
});
exports.editarDadosUsuario = editarDadosUsuario;
//# sourceMappingURL=editarDadosUsuario.js.map