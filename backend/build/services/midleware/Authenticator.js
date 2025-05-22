"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.HashManager = exports.Authenticator = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!SECRET_KEY) {
    throw new Error("A variável de ambiente JWT_SECRET_KEY não está definida!");
}
class Authenticator {
    generateToken(info, expiresIn = "12h") {
        try {
            const token = jwt.sign({ id_usuario: info.id_usuario, tipo: info.tipo }, SECRET_KEY, { expiresIn });
            return token;
        }
        catch (error) {
            console.error("Erro ao gerar token:", error);
            throw new Error("Não foi possível gerar o token.");
        }
    }
    getTokenData(token) {
        try {
            const payload = jwt.verify(token, SECRET_KEY);
            return payload;
        }
        catch (error) {
            console.error("Erro ao verificar token:", error);
            throw new Error("Token inválido ou expirado.");
        }
    }
}
exports.Authenticator = Authenticator;
class HashManager {
    hash(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const rounds = Number(process.env.BCRYPT_COST) || 10;
            if (isNaN(rounds) || rounds < 4 || rounds > 14) {
                throw new Error("BCRYPT_COST deve ser um número entre 4 e 14.");
            }
            const salt = yield bcrypt.genSalt(rounds);
            return bcrypt.hash(text, salt);
        });
    }
    compare(text, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return bcrypt.compare(text, hash);
            }
            catch (error) {
                console.error("Erro ao comparar senhas:", error);
                throw new Error("Erro ao verificar a senha.");
            }
        });
    }
}
exports.HashManager = HashManager;
//# sourceMappingURL=Authenticator.js.map