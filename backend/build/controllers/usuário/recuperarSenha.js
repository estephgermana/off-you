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
exports.recuperarSenhaUsuario = void 0;
const connection_1 = __importDefault(require("../../connection"));
const Authenticator_1 = require("../../services/midleware/Authenticator");
const yup = __importStar(require("yup"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const schemaEmail = yup.object({
    email: yup.string().email().required(),
});
const transport = nodemailer_1.default.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "e51df9f883856e",
        pass: "a645257fe7f307"
    }
});
const recuperarSenhaUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield schemaEmail.validate(req.body, { abortEarly: false });
        const { email } = req.body;
        const usuario = yield (0, connection_1.default)('usuario').where({ email }).first();
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        const auth = new Authenticator_1.Authenticator();
        const tokenRecuperacao = auth.generateToken({
            id_usuario: usuario.id_usuario,
            tipo: usuario.tipo_usuario,
        }, '15m');
        const linkRecuperacao = `http://localhost:3000/redefinir-senha?token=${tokenRecuperacao}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperação de Senha',
            text: `Clique no link para redefinir sua senha: ${linkRecuperacao}`,
        };
        yield transport.sendMail(mailOptions);
        res.status(200).json({
            message: 'Token de recuperação gerado e enviado por e-mail.',
        });
    }
    catch (error) {
        console.error(error);
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
        }
        res.status(500).json({ message: 'Erro ao processar solicitação de recuperação de senha.' });
    }
});
exports.recuperarSenhaUsuario = recuperarSenhaUsuario;
//# sourceMappingURL=recuperarSenha.js.map