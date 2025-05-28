import { Request, Response, NextFunction } from 'express';
import { Authenticator } from '../midleware/Authenticator';
import jwt from 'jsonwebtoken';


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


export const validarToken = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token ausente' });
    }

    const token = authHeader.split(' ')[1];

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);

    return res.status(200).json({ email: decoded.email });
  } catch {
    return res.status(400).json({ message: 'Erro ao validar token.' });
  }
};
