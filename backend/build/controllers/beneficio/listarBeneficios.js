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
exports.listarBeneficios = void 0;
const connection_1 = __importDefault(require("../../connection"));
const listarBeneficios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beneficios = yield (0, connection_1.default)('beneficio').select('*');
        res.status(200).json(beneficios);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Ocorreu um erro inesperado ao listar os benefícios.');
    }
});
exports.listarBeneficios = listarBeneficios;
//# sourceMappingURL=listarBeneficios.js.map