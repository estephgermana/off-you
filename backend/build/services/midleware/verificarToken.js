"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarToken = void 0;
const Authenticator_1 = require("../midleware/Authenticator");
const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Token não informado.' });
        }
        const token = authHeader.split(" ")[1];
        const auth = new Authenticator_1.Authenticator();
        const dados = auth.getTokenData(token);
        req.body.tokenData = dados;
        next();
    }
    catch (_a) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};
exports.verificarToken = verificarToken;
//# sourceMappingURL=verificarToken.js.map