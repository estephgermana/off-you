import { AuthenticationData } from "../../types/AuthenticationData";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import dotenv from 'dotenv';

dotenv.config();

// Garantir que a variável de ambiente esteja definida
const SECRET_KEY: string = process.env.JWT_SECRET_KEY!;

if (!SECRET_KEY) {
    throw new Error("A variável de ambiente JWT_SECRET_KEY não está definida!");
}

export class Authenticator {
    generateToken(info: AuthenticationData): string {
        try {
            const token = jwt.sign(
                { id_usuario: info.id_usuario, tipo: info.tipo },
                SECRET_KEY,
                { expiresIn: "12h" }
            );
            return token;
        } catch (error) {
            console.error("Erro ao gerar token:", error);
            throw new Error("Não foi possível gerar o token.");
        }
    }

    getTokenData(token: string): AuthenticationData {
        try {
            const payload = jwt.verify(token, SECRET_KEY);
            return payload as AuthenticationData;
        } catch (error) {
            console.error("Erro ao verificar token:", error);
            throw new Error("Token inválido ou expirado.");
        }
    }
}

export class HashManager {
    public async hash(text: string): Promise<string> {
        const rounds = Number(process.env.BCRYPT_COST) || 10;
        if (isNaN(rounds) || rounds < 4 || rounds > 14) {
            throw new Error("BCRYPT_COST deve ser um número entre 4 e 14.");
        }
        const salt = await bcrypt.genSalt(rounds);
        return bcrypt.hash(text, salt);
    }

    public async compare(text: string, hash: string): Promise<boolean> {
        try {
            return bcrypt.compare(text, hash);
        } catch (error) {
            console.error("Erro ao comparar senhas:", error);
            throw new Error("Erro ao verificar a senha.");
        }
    }
}
