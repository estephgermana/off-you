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
exports.contratarBeneficio = void 0;
const connection_1 = __importDefault(require("../../connection"));
const uuid_1 = require("uuid");
const Authenticator_1 = require("../../services/midleware/Authenticator");
const gerarCodigoCupom = () => {
    return (0, uuid_1.v4)();
};
const contratarBeneficio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { id_beneficio } = req.body;
        const usuario = yield (0, connection_1.default)('usuario').where('id_usuario', idUsuarioLogado).first();
        if (!usuario) {
            return res.status(400).json({ message: 'Usuário não encontrado.' });
        }
        const beneficio = yield (0, connection_1.default)('beneficio').where('id_beneficio', id_beneficio).first();
        if (!beneficio) {
            return res.status(404).json({ message: 'Benefício não encontrado.' });
        }
        if (usuario.saldo < beneficio.valor_beneficio) {
            return res.status(406).json({ message: 'Saldo insuficiente.' });
        }
        let codigo_cupon;
        yield connection_1.default.transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            const [id_contratacao] = yield trx('beneficios_contratados').insert({
                id_usuario: idUsuarioLogado,
                id_beneficio,
                valor_contratacao: beneficio.valor_beneficio
            }).returning('id_contratacao');
            codigo_cupon = gerarCodigoCupom();
            const validade = new Date();
            validade.setMonth(validade.getMonth() + 6);
            yield trx('cupons_gerados').insert({
                id_contratacao,
                codigo_cupon,
                validade
            });
            yield trx('usuario').where('id_usuario', idUsuarioLogado).update({
                saldo: usuario.saldo - beneficio.valor_beneficio
            });
        }));
        res.status(200).json({ message: 'Benefício contratado e cupom gerado com sucesso.', codigo_cupon });
    }
    catch (error) {
        console.error('Ocorreu um erro ao contratar o benefício e gerar o cupom:', error);
        res.status(500).send('Ocorreu um erro inesperado ao contratar o benefício.');
    }
});
exports.contratarBeneficio = contratarBeneficio;
//# sourceMappingURL=contratarBeneficio.js.map