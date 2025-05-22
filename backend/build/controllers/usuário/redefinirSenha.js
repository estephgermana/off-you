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
exports.redefinirSenha = void 0;
const connection_1 = __importDefault(require("../../connection"));
const yup = __importStar(require("yup"));
const Authenticator_1 = require("../../services/midleware/Authenticator");
const schemaRedefinir = yup.object({
    senha: yup.string().min(6).required(),
    token: yup.string().required(),
});
const redefinirSenha = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield schemaRedefinir.validate(req.body, { abortEarly: false });
        const { senha, token } = req.body;
        const auth = new Authenticator_1.Authenticator();
        const tokenData = auth.getTokenData(token);
        const usuario = yield (0, connection_1.default)('usuario')
            .where({ id_usuario: tokenData.id_usuario })
            .first();
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        const hashManager = new Authenticator_1.HashManager();
        const senhaHash = yield hashManager.hash(senha);
        yield (0, connection_1.default)('usuario')
            .where({ id_usuario: tokenData.id_usuario })
            .update({ senha: senhaHash });
        res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token inválido ou expirado.' });
        }
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
        }
        res.status(500).json({ message: 'Erro ao redefinir a senha.' });
    }
});
exports.redefinirSenha = redefinirSenha;
//# sourceMappingURL=redefinirSenha.js.map