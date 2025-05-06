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
exports.obterBeneficioPorID = void 0;
const connection_1 = __importDefault(require("../../connection"));
const Authenticator_1 = require("../../services/midleware/Authenticator");
const obterBeneficioPorID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Acesso não autorizado' });
        }
        const token = authHeader.split(' ')[1];
        const auth = new Authenticator_1.Authenticator();
        const tokenData = auth.getTokenData(token);
        if (tokenData.tipo !== 'adm') {
            return res.status(403).json({ message: 'Acesso negado' });
        }
        const { id_beneficio } = req.params;
        const beneficio = yield (0, connection_1.default)('beneficio').where('id_beneficio', id_beneficio).first();
        if (!beneficio) {
            return res.status(404).json({ message: 'Benefício não encontrado.' });
        }
        res.status(200).json(beneficio);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Ocorreu um erro inesperado ao obter o benefício.');
    }
});
exports.obterBeneficioPorID = obterBeneficioPorID;
//# sourceMappingURL=obterBeneficioPorID.js.map