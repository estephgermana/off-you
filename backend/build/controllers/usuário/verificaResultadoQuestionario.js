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
exports.verificarResultadoQuestionario = void 0;
const connection_1 = __importDefault(require("../../connection"));
const Authenticator_1 = require("../../services/midleware/Authenticator");
const verificarResultadoQuestionario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
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
        const resultado = yield (0, connection_1.default)('resultados_questionario')
            .where({ usuario_id: usuarioId })
            .first();
        if (resultado) {
            return res.json({
                jaRespondeu: true,
                resultado: {
                    grau: resultado.grau,
                    descricao: resultado.descricao,
                    pontuacao: resultado.pontuacao
                }
            });
        }
        res.json({ jaRespondeu: false });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao verificar resultado do questionário.' });
    }
});
exports.verificarResultadoQuestionario = verificarResultadoQuestionario;
//# sourceMappingURL=verificaResultadoQuestionario.js.map