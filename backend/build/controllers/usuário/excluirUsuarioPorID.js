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
exports.excluirUsuarioPorID = void 0;
const connection_1 = __importDefault(require("../../connection"));
const Authenticator_1 = require("../../services/midleware/Authenticator");
const excluirUsuarioPorID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Acesso não autorizado' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido ou malformado' });
        }
        const auth = new Authenticator_1.Authenticator();
        let tokenData;
        try {
            tokenData = auth.getTokenData(token);
        }
        catch (error) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        if (tokenData.tipo !== 'usuario') {
            return res.status(403).json({ message: 'Acesso negado' });
        }
        const idUsuarioLogado = tokenData.id_usuario;
        const usuarioExistente = yield (0, connection_1.default)('usuario').where('id_usuario', idUsuarioLogado).first();
        if (!usuarioExistente) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        yield (0, connection_1.default)('indicacao').where('cpf_usuario', usuarioExistente.cpf).del();
        yield (0, connection_1.default)('beneficios_contratados').where('id_usuario', usuarioExistente.id_usuario).del();
        yield (0, connection_1.default)('usuario').where('id_usuario', idUsuarioLogado).del();
        res.status(200).json({ message: 'Usuário excluído com sucesso.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Ocorreu um erro inesperado ao excluir o usuário.');
    }
});
exports.excluirUsuarioPorID = excluirUsuarioPorID;
//# sourceMappingURL=excluirUsuarioPorID.js.map