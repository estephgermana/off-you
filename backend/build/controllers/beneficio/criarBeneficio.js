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
exports.criarBeneficio = void 0;
const connection_1 = __importDefault(require("../../connection"));
const Authenticator_1 = require("../../services/midleware/Authenticator");
const criarBeneficio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { valor_beneficio, nome_beneficio } = req.body;
        yield (0, connection_1.default)('beneficio').insert({
            valor_beneficio,
            nome_beneficio
        });
        res.status(201).json({ message: 'Benefício criado com sucesso.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Ocorreu um erro inesperado ao criar o benefício.');
    }
});
exports.criarBeneficio = criarBeneficio;
//# sourceMappingURL=criarBeneficio.js.map