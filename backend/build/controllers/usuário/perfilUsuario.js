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
exports.perfilUsuario = void 0;
const connection_1 = __importDefault(require("../../connection"));
const perfilUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_usuario } = req.body.tokenData;
        const usuario = yield (0, connection_1.default)('usuario')
            .select('nome', 'email', 'tipo_usuario', 'data_nascimento', 'data_cadastro')
            .where({ id_usuario })
            .first();
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json({ usuario });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar perfil.' });
    }
});
exports.perfilUsuario = perfilUsuario;
//# sourceMappingURL=perfilUsuario.js.map