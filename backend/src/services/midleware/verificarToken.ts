import { Request, Response, NextFunction } from 'express';
import { Authenticator } from '../midleware/Authenticator';

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token não informado.' });
    }

    const token = authHeader.split(" ")[1];

    const auth = new Authenticator();
    const dados = auth.getTokenData(token);

    req.body.tokenData = dados; 

    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};
