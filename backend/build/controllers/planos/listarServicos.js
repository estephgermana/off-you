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
exports.listarServicos = void 0;
const connection_1 = __importDefault(require("../../connection"));
const listarServicos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const servicos = yield (0, connection_1.default)('servicos').select('*');
        res.status(200).json(servicos);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Ocorreu um erro inesperado ao listar os serviços.');
    }
});
exports.listarServicos = listarServicos;
//# sourceMappingURL=listarServicos.js.map