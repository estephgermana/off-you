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
exports.criarUsuario = void 0;
const connection_1 = __importDefault(require("../../connection"));
const uuid_1 = require("uuid");
const Authenticator_1 = require("../../services/midleware/Authenticator");
const incrementarSaldoUsuarioIndicacao = (codigoIndicacao) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const indicacao = yield (0, connection_1.default)('indicacao').where('codigo_indicacao_por_cpf', codigoIndicacao).first();
        if (!indicacao) {
            console.log('Código de indicação inválido.');
            return;
        }
        const cpfUsuarioIndicador = indicacao.cpf_usuario;
        yield (0, connection_1.default)('usuario').where('cpf', cpfUsuarioIndicador).increment('saldo', 1);
        console.log('Saldo do usuário indicador incrementado com sucesso.');
    }
    catch (error) {
        console.error('Ocorreu um erro ao incrementar o saldo do usuário indicador:', error);
    }
});
const criarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cpf, telefone, email, data_nascimento, nome_completo, nome_plano, logradouro, numero, complemento, codigo_indicacao_origem, senha, tipo } = req.body;
        const codigoIndicacaoPorCpf = (0, uuid_1.v4)();
        const userIdUsuario = (0, uuid_1.v4)();
        let codigoIndicacaoDeOrigem = codigo_indicacao_origem;
        let saldoInicial = 0;
        const cypherPassword = new Authenticator_1.HashManager();
        const senhaHash = yield cypherPassword.hash(senha);
        if (codigo_indicacao_origem) {
            yield incrementarSaldoUsuarioIndicacao(codigo_indicacao_origem);
            const indicacaoOrigem = yield (0, connection_1.default)('indicacao').where('codigo_indicacao_por_cpf', codigo_indicacao_origem).first();
            if (indicacaoOrigem) {
                codigoIndicacaoDeOrigem = indicacaoOrigem.codigo_indicacao_por_cpf;
                saldoInicial += 5;
            }
            else {
                return res.status(400).json({ message: 'Código de indicação de origem inválido.' });
            }
        }
        let servicoNomePlano = null;
        if (nome_plano) {
            const servico = yield (0, connection_1.default)('servicos').where('id_servico', nome_plano).first();
            if (!servico) {
                return res.status(400).json({ message: 'Serviço não encontrado para o id_servico fornecido.' });
            }
            servicoNomePlano = servico.nome_plano;
            saldoInicial += 10;
        }
        yield connection_1.default.transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            yield trx('usuario').insert({
                id_usuario: userIdUsuario,
                cpf,
                telefone,
                email,
                data_nascimento,
                nome_completo,
                nome_plano: servicoNomePlano,
                logradouro,
                numero,
                complemento,
                codigo_indicacao_origem: codigoIndicacaoDeOrigem,
                saldo: saldoInicial,
                senha: senhaHash,
                tipo
            });
            yield trx('indicacao').insert({
                codigo_indicacao_por_cpf: codigoIndicacaoPorCpf,
                cpf_usuario: cpf
            });
        }));
        const auth = new Authenticator_1.Authenticator();
        const token = auth.generateToken({ id_usuario: userIdUsuario, tipo });
        res.status(201).json({ message: 'Usuário cadastrado com sucesso.', codigoIndicacaoPorCpf, token });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Ocorreu um erro inesperado ao cadastrar o usuário.');
    }
});
exports.criarUsuario = criarUsuario;
//# sourceMappingURL=criarUsuario.js.map