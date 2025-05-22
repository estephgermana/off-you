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
exports.resultadoQuestionario = void 0;
const connection_1 = __importDefault(require("../../connection"));
const yup = __importStar(require("yup"));
const uuid_1 = require("uuid");
const Authenticator_1 = require("../../services/midleware/Authenticator");
const schemaResultado = yup.object({
    grau: yup.string().required('Grau é obrigatório'),
    descricao: yup.string().required('Descrição é obrigatória'),
    pontuacao: yup.number().required('Pontuação é obrigatória'),
    data: yup.date().notRequired(),
});
const resultadoQuestionario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        yield schemaResultado.validate(req.body, { abortEarly: false });
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }
        const authenticator = new Authenticator_1.Authenticator();
        const payload = authenticator.getTokenData(token);
        if (!payload || !payload.id_usuario) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        const usuarioId = payload.id_usuario;
        const respostaExistente = yield (0, connection_1.default)('resultados_questionario')
            .where({ usuario_id: usuarioId })
            .first();
        if (respostaExistente) {
            return res.status(400).json({ message: 'Você já respondeu o questionário.' });
        }
        const { grau, descricao, pontuacao } = req.body;
        const id_resultado = (0, uuid_1.v4)();
        yield (0, connection_1.default)('resultados_questionario').insert({
            id_resultado,
            usuario_id: usuarioId,
            grau,
            descricao,
            pontuacao
        });
        res.status(201).json({ message: 'Resultado salvo com sucesso.' });
    }
    catch (error) {
        console.error(error);
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
        }
        res.status(500).json({ message: 'Erro inesperado ao salvar resultado.' });
    }
});
exports.resultadoQuestionario = resultadoQuestionario;
//# sourceMappingURL=resultadoQuestionario.js.map