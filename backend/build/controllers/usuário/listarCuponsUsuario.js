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
exports.listarCuponsUsuario = void 0;
const connection_1 = __importDefault(require("../../connection"));
const Authenticator_1 = require("../../services/midleware/Authenticator");
const listarCuponsUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const cupons = yield (0, connection_1.default)('cupons_gerados')
            .join('beneficios_contratados', 'cupons_gerados.id_contratacao', '=', 'beneficios_contratados.id_contratacao')
            .where('beneficios_contratados.id_usuario', idUsuarioLogado)
            .select('cupons_gerados.id_contratacao', 'cupons_gerados.codigo_cupon', 'cupons_gerados.validade');
        res.status(200).json(cupons);
    }
    catch (error) {
        console.error('Erro ao listar os cupons do usuário:', error);
        res.status(500).send('Ocorreu um erro inesperado ao listar os cupons do usuário.');
    }
});
exports.listarCuponsUsuario = listarCuponsUsuario;
//# sourceMappingURL=listarCuponsUsuario.js.map