"use strict";
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
const bcryptjs_1 = require("bcryptjs");
const loginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ message: "Por favor, preencha os campos 'email' e 'senha'" });
        }
        const usuario = yield (0, connection_1.default)('usuario').where({ email }).first();
        if (!usuario) {
            return res.status(400).json({ message: 'Email não existe!' });
        }
        const passwordIsCorrect = yield (0, bcryptjs_1.compare)(senha, usuario.senha);
        if (!passwordIsCorrect) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }
        const auth = new Authenticator_1.Authenticator();
        const token = auth.generateToken({ id_usuario: usuario.id_usuario, tipo: usuario.tipo });
        return res.status(200).json({ message: "Login realizado", token });
    }
    catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ message: 'Ocorreu um erro inesperado ao tentar fazer login.' });
    }
});
exports.loginUsuario = loginUsuario;
//# sourceMappingURL=loginUsuario.js.map