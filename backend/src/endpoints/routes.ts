import { Router } from 'express';

import { criarUsuario } from '../controllers/usuário/criarUsuario';
import { loginUsuario } from '../controllers/usuário/loginUsuario';
import { recuperarSenhaUsuario } from '../controllers/usuário/recuperarSenha';
import { perfilUsuario } from '../controllers/usuário/perfilUsuario';
import { verificarToken } from '../services/midleware/verificarToken';
import { editarDadosUsuario } from '../controllers/usuário/editarDadosUsuario';
import { deletarUsuario } from '../controllers/usuário/deletarUsuario';
import { redefinirSenha } from "../controllers/usuário/redefinirSenha";
import { resultadoQuestionario } from '../controllers/usuário/resultadoQuestionario';

const router = Router();

//Usuario
router.post('/cadastro', criarUsuario);
router.post('/login', loginUsuario);  
router.patch('/recuperar-senha', recuperarSenhaUsuario);
router.get('/perfil', verificarToken, perfilUsuario);
router.put('/perfil/editar-dados', verificarToken, editarDadosUsuario);
router.delete('/perfil/excluir-cadastro', verificarToken, deletarUsuario);
router.post('/recuperar-senha', recuperarSenhaUsuario);
router.post('/redefinir-senha', redefinirSenha);
router.post('/resultado-questionario', verificarToken, resultadoQuestionario);

export { router };
