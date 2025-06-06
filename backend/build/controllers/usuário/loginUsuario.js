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
exports.loginUsuario = void 0;
const connection_1 = __importDefault(require("../../connection"));
const Authenticator_1 = require("../../services/midleware/Authenticator");
const yup = __importStar(require("yup"));
const schemaLogin = yup.object({
    email: yup.string().email('Formato de email inválido.').required('Email é obrigatório.'),
    senha: yup.string().required('Senha é obrigatória.'),
});
const loginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield schemaLogin.validate(req.body, { abortEarly: false });
        const { email, senha } = req.body;
        const usuario = yield (0, connection_1.default)('usuario').where({ email }).first();
        if (!usuario) {
            return res.status(400).json({ message: 'Usuário ou senha inválidos.' });
        }
        const hashManager = new Authenticator_1.HashManager();
        const senhaValida = yield hashManager.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ message: 'Usuário ou senha inválidos.' });
        }
        const auth = new Authenticator_1.Authenticator();
        const token = auth.generateToken({
            id_usuario: usuario.id_usuario,
            tipo: usuario.tipo_usuario,
        });
        res.status(200).json({ message: 'Login realizado com sucesso.', token });
    }
    catch (error) {
        console.error(error);
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
        }
        res.status(500).json({ message: 'Erro inesperado ao realizar login.' });
    }
});
exports.loginUsuario = loginUsuario;
//# sourceMappingURL=loginUsuario.js.map