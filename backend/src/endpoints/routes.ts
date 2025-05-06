import { Router } from 'express';

import { criarUsuario } from '../controllers/usuário/criarUsuario';
import { loginUsuario } from '../controllers/usuário/loginUsuario';


const router = Router();

//Usuario
router.post('/cadastro', criarUsuario);
router.post('/login', loginUsuario);  


export { router };
