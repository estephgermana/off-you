import { Router } from 'express';

import { criarUsuario } from '../controllers/usuário/criarUsuario';
import { loginUsuario } from '../controllers/usuário/loginUsuario';
import { recuperarSenhaUsuario } from '../controllers/usuário/recuperarSenha';
import { perfilUsuario } from '../controllers/usuário/perfilUsuario';
import { validarToken, verificarToken } from '../services/midleware/verificarToken';
import { editarDadosUsuario } from '../controllers/usuário/editarDadosUsuario';
import { deletarUsuario } from '../controllers/usuário/deletarUsuario';
import { redefinirSenha } from "../controllers/usuário/redefinirSenha";
import { resultadoQuestionario } from '../controllers/usuário/resultadoQuestionario';
import { verificarResultadoQuestionario } from '../controllers/usuário/verificaResultadoQuestionario';

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
router.get('/validar_resposta_questionario', verificarResultadoQuestionario);
router.get('/validar-token', verificarToken, validarToken)


export { router };
