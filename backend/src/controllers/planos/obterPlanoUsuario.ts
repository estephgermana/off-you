import { Request, Response } from 'express';
import knex from '../../connection';
import { Authenticator } from '../../services/midleware/Authenticator';

export const obterPlanosUsuario = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    const authenticator = new Authenticator();
    const payload = authenticator.getTokenData(token);
    if (!payload || !payload.id_usuario) return res.status(401).json({ message: 'Token inválido' });

    const usuarioId = payload.id_usuario;

    const planos = await knex('diario_atividade as d')
      .join('tipo_plano_acao as p', 'd.id_plano', 'p.id_tipo_plano')
      .where('d.id_usuario', usuarioId)
      .distinct('p.id_tipo_plano', 'p.titulo', 'p.faixa_etaria', 'p.grau_dependencia');

    if (planos.length === 0) {
      return res.status(404).json({ message: 'Nenhum plano associado encontrado para este usuário' });
    }

    const planosComAtividades = await Promise.all(
      planos.map(async (plano) => {
        const atividades = await knex('diario_atividade as d')
          .join('atividade as a', 'd.id_atividade', 'a.id_atividade')
          .where('d.id_usuario', usuarioId)
          .andWhere('d.id_plano', plano.id_tipo_plano)
          .select('a.id_atividade', 'a.titulo', 'a.descricao', 'd.comentario', 'd.avaliacao', 'd.feita', 'd.data_registro');

        return {
          id_plano: plano.id_tipo_plano,
          titulo: plano.titulo,
          faixaEtaria: plano.faixa_etaria,
          grauDependencia: plano.grau_dependencia,
          sugestoes: atividades.map(a => a.descricao),
          atividades: atividades.map(a => ({
            id_atividade: a.id_atividade,
            descricao: a.descricao
          }))
        };
      })
    );

    res.status(200).json(planosComAtividades);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar planos e atividades do usuário' });
  }
};
