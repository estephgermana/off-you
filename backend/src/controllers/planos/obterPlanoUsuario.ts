import { Request, Response } from 'express';
import knex from '../../connection';
import { Authenticator } from '../../services/midleware/Authenticator';

export const obterPlanoUsuario = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    const authenticator = new Authenticator();
    const payload = authenticator.getTokenData(token);
    if (!payload || !payload.id_usuario) return res.status(401).json({ message: 'Token inválido' });

    const usuarioId = payload.id_usuario;

    // Buscar o plano associado ao usuário (com base nas atividades no diário)
    const planoUsuario = await knex('diario_atividade as d')
      .join('tipo_plano_acao as p', 'd.id_plano', 'p.id_tipo_plano')
      .where('d.id_usuario', usuarioId)
      .select('p.id_tipo_plano as id', 'p.titulo', 'p.faixa_etaria', 'p.grau_dependencia')
      .first();

    if (!planoUsuario) {
      return res.status(404).json({ message: 'Nenhum plano associado encontrado para este usuário' });
    }

    // Buscar as atividades associadas ao plano e ao usuário no diário
    const atividades = await knex('diario_atividade as d')
      .join('atividade as a', 'd.id_atividade', 'a.id_atividade')
      .where('d.id_usuario', usuarioId)
      .andWhere('d.id_plano', planoUsuario.id)
      .select('a.id_atividade', 'a.titulo', 'a.descricao', 'd.comentario', 'd.avaliacao', 'd.feita', 'd.data_registro');

    res.status(200).json({
    titulo: planoUsuario.titulo,
    grauDependencia: planoUsuario.grau_dependencia,
    faixaEtaria: planoUsuario.faixa_etaria,
    id_plano: planoUsuario.id,
    sugestoes: atividades.map(a => a.descricao),
    atividades: atividades.map(a => ({
      id_atividade: a.id_atividade,
      descricao: a.descricao
  }))
});


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar plano e atividades do usuário' });
  }
};
