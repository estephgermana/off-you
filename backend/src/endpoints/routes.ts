import { Router } from 'express';

import { criarUsuario } from '../controllers/usuário/criarUsuario';
import { loginUsuario } from '../controllers/usuário/loginUsuario';
import { recuperarSenhaUsuario } from '../controllers/usuário/recuperarSenhaUsuario';


const router = Router();

//Usuario
router.post('/cadastro', criarUsuario);
router.post('/login', loginUsuario);  
router.patch('/recuperar-senha', recuperarSenhaUsuario);


export { router };
