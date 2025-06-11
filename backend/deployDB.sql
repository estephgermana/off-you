-- usuario
CREATE TABLE usuario (
id_usuario UUID PRIMARY KEY,
nome VARCHAR(300) NOT NULL,
email VARCHAR(250) NOT NULL,
senha VARCHAR(100) NOT NULL,
tipo_usuario VARCHAR(50) NOT NULL,
data_cadastro DATE DEFAULT CURRENT_DATE,
data_nascimento_vitima DATE DEFAULT NULL,
pontos INT DEFAULT 0
);

-- Tipo de Plano de Ação
CREATE TABLE tipo_plano_acao (
id_tipo_plano UUID PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
descricao VARCHAR(500)
);

-- Questionário
CREATE TABLE questionario (
id_questionario UUID PRIMARY KEY,
titulo VARCHAR(200) NOT NULL,
descricao VARCHAR(500) NOT NULL
);

-- Pergunta
CREATE TABLE pergunta (
id_pergunta UUID PRIMARY KEY,
id_questionario UUID REFERENCES questionario(id_questionario),
descricao_pergunta VARCHAR(500) NOT NULL,
tipo_resposta VARCHAR(100) NOT NULL
);

-- Plano de Ação
CREATE TABLE plano_de_acao (
id_plano UUID PRIMARY KEY,
id_usuario UUID REFERENCES usuario(id_usuario),
id_tipo_plano UUID REFERENCES tipo_plano_acao(id_tipo_plano),
data_inicio DATE NOT NULL,
data_fim DATE NOT NULL
);

-- Atividade
CREATE TABLE atividade (
id_atividade UUID PRIMARY KEY,
titulo VARCHAR(200) NOT NULL,
descricao VARCHAR(500) NOT NULL,
tipo VARCHAR(100) NOT NULL
);

-- Atividade no Plano de Ação
CREATE TABLE atividade_plano (
id_plano UUID REFERENCES plano_de_acao(id_plano),
id_atividade UUID REFERENCES atividade(id_atividade),
status VARCHAR(100) NOT NULL,
observacoes VARCHAR(500) NOT NULL,
data_conclusao DATE NOT NULL,
PRIMARY KEY (id_plano, id_atividade)
);

-- Resposta
CREATE TABLE resposta (
id_resposta UUID PRIMARY KEY,
id_pergunta UUID REFERENCES pergunta(id_pergunta),
id_usuario UUID REFERENCES usuario(id_usuario),
resposta_usuario VARCHAR(500) NOT NULL
);

-- Diário da Atividade
CREATE TABLE diario_atividade (
id_diario UUID PRIMARY KEY,
id_plano UUID,
id_atividade UUID,
id_usuario UUID REFERENCES usuario(id_usuario),
entrada_diario VARCHAR(800) NOT NULL,
data_registro DATE DEFAULT CURRENT_DATE,
FOREIGN KEY (id_plano, id_atividade) REFERENCES atividade_plano(id_plano, id_atividade)
);

-- Conquista
CREATE TABLE conquista (
id_conquista UUID PRIMARY KEY,
id_usuario UUID REFERENCES usuario(id_usuario),
descricao VARCHAR(500) NOT NULL,
data_conquista DATE NOT NULL,
quantidade_estrelas INT NOT NULL
);

ALTER TABLE usuario
ADD COLUMN nivel_proximidade VARCHAR(20) NOT NULL DEFAULT 'medio';

DROP TABLE IF EXISTS resposta;
DROP TABLE IF EXISTS pergunta;
DROP TABLE IF EXISTS questionario;

CREATE TABLE resultados_questionario (
id_resultado UUID PRIMARY KEY,
usuario_id UUID NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
grau TEXT NOT NULL,
descricao TEXT NOT NULL,
pontuacao INTEGER NOT NULL,
data_resposta DATE DEFAULT CURRENT_DATE
);

select * from resultados_questionario;
select * from usuario;

-- ALTERAÇÕES PARA 'tipo_plano_acao'
ALTER TABLE tipo_plano_acao
RENAME COLUMN nome TO titulo; -- Renomeia a coluna 'nome' para 'titulo'

ALTER TABLE tipo_plano_acao
ADD COLUMN faixa_etaria VARCHAR(50) NOT NULL; -- Adiciona a coluna faixa_etaria

ALTER TABLE tipo_plano_acao
ADD COLUMN grau_dependencia VARCHAR(50) NOT NULL; -- Adiciona a coluna grau_dependencia

ALTER TABLE atividade
ADD COLUMN id_tipo_plano UUID NOT NULL; -- Adiciona a chave estrangeira

ALTER TABLE atividade
DROP COLUMN IF EXISTS id_tipo_plano;

ALTER TABLE atividade
ADD COLUMN id_tipo_plano UUID;



-- Adiciona a restrição de chave estrangeira (assumindo que id_tipo_plano é PK em tipo_plano_acao)
ALTER TABLE atividade
ADD CONSTRAINT fk_atividade_tipo_plano
FOREIGN KEY (id_tipo_plano) REFERENCES tipo_plano_acao(id_tipo_plano);

DROP TABLE IF EXISTS atividade_plano CASCADE;

-- *** Parte 2: Alterações na tabela diario_atividade (para ser o "Salvar Atividade") ***

-- 1. Renomear a coluna 'entrada_diario' para 'comentario'
ALTER TABLE diario_atividade
RENAME COLUMN entrada_diario TO comentario;

-- 2. Adicionar a coluna 'avaliacao'
ALTER TABLE diario_atividade
ADD COLUMN avaliacao INT DEFAULT 0; -- O valor padrão 0 é bom para quando não há avaliação

-- 3. Adicionar a coluna 'feita'
ALTER TABLE diario_atividade
ADD COLUMN feita BOOLEAN DEFAULT TRUE NOT NULL; -- Assumimos TRUE, pois só registramos atividades "feitas"


ALTER TABLE tipo_plano_acao
ALTER COLUMN id_tipo_plano DROP DEFAULT;
ALTER TABLE tipo_plano_acao
ALTER COLUMN id_tipo_plano TYPE UUID;

INSERT INTO tipo_plano_acao (id_tipo_plano, titulo, descricao, faixa_etaria, grau_dependencia) VALUES
-- 0-4 anos
('2a678dec-f004-4410-b9de-dce6749b07a3', 'Plano de Ação: Uso Saudável (0-4 anos)', '', '0-4 anos', 'Uso saudável'),
('4a1ade9e-dc48-4f34-a64a-0e36b7138c65', 'Plano de Ação: Dependência Leve (0-4 anos)', '', '0-4 anos', 'Dependência leve'),
('bfffb11b-8b26-4db5-91aa-8e7996d281eb', 'Plano de Ação: Dependência Moderada (0-4 anos)', '', '0-4 anos', 'Dependência moderada'),
('ea4bd265-5a87-4db9-818e-44e40d9be881', 'Plano de Ação: Dependência Severa (0-4 anos)', '', '0-4 anos', 'Dependência severa'),
-- 5-9 anos
('c00ab75f-bd3c-4a79-85fc-7bde2541f118', 'Plano de Ação: Uso Saudável (5-9 anos)', '', '5-9 anos', 'Uso saudável'),
('775c8ef1-30e8-4a47-bf2d-580e458fdc67', 'Plano de Ação: Dependência Leve (5-9 anos)', '', '5-9 anos', 'Dependência leve'),
('2c89e3cd-f313-4e90-ae4c-9ecb6cd43f5d', 'Plano de Ação: Dependência Moderada (5-9 anos)', '', '5-9 anos', 'Dependência moderada'),
('fa416055-9b44-420b-b7e2-3ac61c4f13ce', 'Plano de Ação: Dependência Severa (5-9 anos)', '', '5-9 anos', 'Dependência severa');

select * from tipo_plano_acao;

-- Plano: 2a678dec-f004-4410-b9de-dce6749b07a3
INSERT INTO atividade (id_atividade, titulo, descricao, tipo, id_tipo_plano) VALUES
('bc0aae98-7bee-44fa-9402-cf4da877ea94', 'Atividade 1', 'Mantenha o ambiente familiar rico em estímulos offline (brinquedos, livros, atividades ao ar livre).', '', '2a678dec-f004-4410-b9de-dce6749b07a3');
INSERT INTO atividade (id_atividade, titulo, descricao, tipo, id_tipo_plano) VALUES
('226ff8c7-423c-410a-9e18-e324c3e035c6', 'Atividade 2', 'Limite o tempo de tela para no máximo 1 hora por dia, sempre com supervisão.', '', '2a678dec-f004-4410-b9de-dce6749b07a3');
INSERT INTO atividade (id_atividade, titulo, descricao, tipo, id_tipo_plano) VALUES
('b538bc22-7e2b-468c-b8d6-e6ddeed6f88b', 'Atividade 3', 'Priorize brincadeiras interativas e tempo de qualidade em família.', '', '2a678dec-f004-4410-b9de-dce6749b07a3');
INSERT INTO atividade (id_atividade, titulo, descricao, tipo, id_tipo_plano) VALUES
('8b2c4091-b1ec-4f0d-9253-3643b2c445e1', 'Atividade 4', 'Crie momentos de "desconexão" programados para toda a família.', '', '2a678dec-f004-4410-b9de-dce6749b07a3');
INSERT INTO atividade (id_atividade, titulo, descricao, tipo, id_tipo_plano) VALUES
('c3c8e421-2eb4-4562-9926-b5b1a44b91e6', 'Atividade 5', 'Apresente novas texturas e sons através de brincadeiras sensoriais.', '', '2a678dec-f004-4410-b9de-dce6749b07a3');
INSERT INTO atividade (id_atividade, titulo, descricao, tipo, id_tipo_plano) VALUES
('b3cf8018-e1e0-4b0a-a676-379a62616229', 'Atividade 6', 'Incentive o uso de blocos e encaixes para desenvolver coordenação.', '', '2a678dec-f004-4410-b9de-dce6749b07a3');

INSERT INTO atividade (id_atividade, titulo, descricao, tipo, id_tipo_plano) VALUES
('f15a77c9-bf58-422c-91c6-2d64aa12e4a9', 'Atividade 1', 'Crie rotinas bem definidas para o uso de telas, com horários fixos e curtos.', '', '4a1ade9e-dc48-4f34-a64a-0e36b7138c65'),
('547ccf65-939c-4864-8105-40cf64dd7fa8', 'Atividade 2', 'Ofereça alternativas divertidas e envolventes longe das telas, como pintura, massinha, blocos de montar.', '', '4a1ade9e-dc48-4f34-a64a-0e36b7138c65'),
('e72d198b-3e13-4f11-9877-633abbb46d32', 'Atividade 3', 'Aumente o tempo de interação um-a-um com a criança, com brincadeiras que estimulem a criatividade e a coordenação motora.', '', '4a1ade9e-dc48-4f34-a64a-0e36b7138c65'),
('84bc6a49-80ec-4c8c-96c6-3f66e3e626c5', 'Atividade 4', 'Utilize temporizadores visíveis para o tempo de tela.', '', '4a1ade9e-dc48-4f34-a64a-0e36b7138c65'),
('f347a167-6e9a-4e6d-90a9-4709c4d8d7ef', 'Atividade 5', 'Comece a explorar parques e playgrounds como principal fonte de diversão.', '', '4a1ade9e-dc48-4f34-a64a-0e36b7138c65'),
('f321c5c4-41e6-45d7-a2dc-4b58be2b0406', 'Atividade 6', 'Cante músicas e leia livros interativos para desviar o foco das telas.', '', '4a1ade9e-dc48-4f34-a64a-0e36b7138c65');

INSERT INTO atividade (id_atividade, titulo, descricao, tipo, id_tipo_plano) VALUES
('90d82a7d-b1d5-4a07-abe4-374a45263ec1', 'Atividade 1', 'Reduza drasticamente o tempo de tela, preferencialmente eliminando-o temporariamente para reeducação.', '', 'bfffb11b-8b26-4db5-91aa-8e7996d281eb'),
('43c3bb5f-f352-4f49-8c99-84c51a43be02', 'Atividade 2', 'Busque atividades sensoriais e motoras que capturem a atenção da criança (parques, natação, caça ao tesouro).', '', 'bfffb11b-8b26-4db5-91aa-8e7996d281eb'),
('ced87939-d379-438f-89b7-8e73f969ebc4', 'Atividade 3', 'Considere a busca por apoio profissional (pediatra, psicólogo infantil) para orientação e manejo do comportamento.', '', 'bfffb11b-8b26-4db5-91aa-8e7996d281eb'),
('121ecdf4-1019-4b43-8948-98ea9a3a5e2d', 'Atividade 4', 'Crie um "canto offline" em casa com brinquedos e livros convidativos.', '', 'bfffb11b-8b26-4db5-91aa-8e7996d281eb'),
('5de4df67-06f4-44e2-b301-415d742e0650', 'Atividade 5', 'Organize encontros com outras crianças para brincadeiras em grupo.', '', 'bfffb11b-8b26-4db5-91aa-8e7996d281eb'),
('ab28a31f-0c67-4713-9343-538cc435c261', 'Atividade 6', 'Pratique jogos de imitação e faz de conta para estimular a criatividade.', '', 'bfffb11b-8b26-4db5-91aa-8e7996d281eb');

INSERT INTO atividade (id_atividade, titulo, descricao, tipo, id_tipo_plano) VALUES
('d5b88cf4-0eb5-43cd-9846-6bb527afbb70', 'Atividade 1', 'Intervenção imediata: corte total do acesso às telas e remoção de dispositivos eletrônicos do ambiente da criança.', '', 'ea4bd265-5a87-4db9-818e-44e40d9be881'),
('ff63e905-b598-4f8b-9aaf-49fc3ff07a41', 'Atividade 2', 'Busque apoio psicológico e pedagógico especializado para a criança e a família.', '', 'ea4bd265-5a87-4db9-818e-44e40d9be881'),
('49801734-2a9d-4e5c-8f9d-0b33299973ed', 'Atividade 3', 'Crie um ambiente rico em estímulos não digitais e promova o máximo de interação social e física.', '', 'ea4bd265-5a87-4db9-818e-44e40d9be881'),
('8677f2e4-e7eb-465f-91bb-3b7986e76df2', 'Atividade 4', 'Trabalhe com o profissional para um "detox digital" gradual ou abrupto, conforme a recomendação.', '', 'ea4bd265-5a87-4db9-818e-44e40d9be881'),
('8d24430e-e45e-4af6-9375-33c1fe0f1c3b', 'Atividade 5', 'Priorize terapias de brincadeira e desenvolvimento infantil.', '', 'ea4bd265-5a87-4db9-818e-44e40d9be881'),
('9f3e373a-1b86-4934-bd0d-10aa9fbb8ae2', 'Atividade 6', 'Documente e compartilhe os comportamentos e avanços com os especialistas.', '', 'ea4bd265-5a87-4db9-818e-44e40d9be881');

INSERT INTO atividade (id_atividade, titulo, descricao, tipo, id_tipo_plano) VALUES
('76cfd30e-b6aa-4af9-b2a7-7ecf0a57cde5', 'Atividade 1', 'Incentive o uso consciente da internet para aprendizado e lazer, com supervisão parental.', '', 'c00ab75f-bd3c-4a79-85fc-7bde2541f118'),
('eb1f19b8-24c4-4ac6-9c9e-f10c242a6e0f', 'Atividade 2', 'Estimule hobbies e atividades extracurriculares (esportes, música, artes).', '', 'c00ab75f-bd3c-4a79-85fc-7bde2541f118'),
('df171b1e-67e6-4e29-9b63-29032613e97f', 'Atividade 3', 'Mantenha o diálogo aberto sobre os perigos e benefícios da internet, ensinando sobre segurança online.', '', 'c00ab75f-bd3c-4a79-85fc-7bde2541f118'),
('aecb6c54-759a-45a3-8af8-0d4ebf8bc023', 'Atividade 4', 'Estabeleça "zonas livres de tela" em casa, como a mesa de jantar.', '', 'c00ab75f-bd3c-4a79-85fc-7bde2541f118'),
('c5d46b14-6ae4-4fc3-82d2-c0d76cbd9ea0', 'Atividade 5', 'Promova jogos de tabuleiro e atividades em grupo sem tecnologia.', '', 'c00ab75f-bd3c-4a79-85fc-7bde2541f118'),
('9118eaae-dbd1-4b43-81cc-5ee970d3ca45', 'Atividade 6', 'Incentive a leitura de livros de acordo com a idade e interesses.', '', 'c00ab75f-bd3c-4a79-85fc-7bde2541f118');

INSERT INTO atividade (id_atividade, titulo, descricao, tipo, id_tipo_plano) VALUES
('54e67c7d-2a11-4df9-9e14-2e4a1013672b', 'Atividade 1', 'Defina regras claras de tempo de tela e conteúdo, com acordos e consequências.', '', '775c8ef1-30e8-4a47-bf2d-580e458fdc67'),
('e3794e9a-f33c-4fa6-bd11-14f31b9c34a9', 'Atividade 2', 'Incentive a participação em atividades em grupo e brincadeiras ao ar livre com amigos.', '', '775c8ef1-30e8-4a47-bf2d-580e458fdc67'),
('d85a7a0b-6e3f-4380-8a25-6d1c8a5fbb42', 'Atividade 3', 'Explore novos interesses e talentos da criança que não envolvam telas, como leitura, jogos de tabuleiro ou culinária.', '', '775c8ef1-30e8-4a47-bf2d-580e458fdc67'),
('24a9429a-2a6c-4a3b-b9b5-b9d0147a1c0f', 'Atividade 4', 'Crie um "contrato de tela" com a criança, com metas e recompensas.', '', '775c8ef1-30e8-4a47-bf2d-580e458fdc67'),
('7bf152d4-09da-4e9e-996f-7d3a8a57ae1e', 'Atividade 5', 'Ajude a criança a encontrar amigos para brincar presencialmente.', '', '775c8ef1-30e8-4a47-bf2d-580e458fdc67'),
('a7a8f71d-3f7b-4d13-8a8b-1aaf45e8a08f', 'Atividade 6', 'Limitem o uso de telas antes de dormir para melhorar a qualidade do sono.', '', '775c8ef1-30e8-4a47-bf2d-580e458fdc67');

INSERT INTO atividade (id_atividade, titulo, descricao, tipo, id_tipo_plano) VALUES
('42098cf3-681d-4a5a-bbb3-7ddae6e58353', 'Atividade 1', 'Estabeleça um cronograma rigoroso de uso da internet, com períodos de "desintoxicação digital".', '', '2c89e3cd-f313-4e90-ae4c-9ecb6cd43f5d'),
('18f4b681-9d3c-4ddf-bc5b-7ef6746b57f1', 'Atividade 2', 'Aumente o envolvimento em atividades familiares e sociais, buscando reconectar a criança com o mundo real.', '', '2c89e3cd-f313-4e90-ae4c-9ecb6cd43f5d'),
('832b3671-36d1-4de4-95b9-b3d3d1a0c9cd', 'Atividade 3', 'Considere a busca por aconselhamento psicológico para a criança e orientação para os pais.', '', '2c89e3cd-f313-4e90-ae4c-9ecb6cd43f5d'),
('aa4c51e5-7f12-4fcd-95e6-4122ac8c5af7', 'Atividade 4', 'Implemente "dias sem tela" ou "períodos de tela zero".', '', '2c89e3cd-f313-4e90-ae4c-9ecb6cd43f5d'),
('c434de06-7d1a-4d9e-bf71-7bc7b5d02ff7', 'Atividade 5', 'Incentive a participação em esportes ou clubes que exijam foco e disciplina.', '', '2c89e3cd-f313-4e90-ae4c-9ecb6cd43f5d'),
('7ca5e8db-315a-4143-b7ea-d5378e2c9e0c', 'Atividade 6', 'Ensine a criança a identificar e expressar suas emoções, buscando alternativas à fuga para as telas.', '', '2c89e3cd-f313-4e90-ae4c-9ecb6cd43f5d');

INSERT INTO atividade (id_atividade, titulo, descricao, tipo, id_tipo_plano) VALUES
('36de5fa9-3f6e-4a2a-8eaf-d2b7a2a5b7db', 'Atividade 1', 'Intervenção profissional é crucial: procure um psicólogo infantil ou psiquiatra especializado em dependência digital.', '', 'fa416055-9b44-420b-b7e2-3ac61c4f13ce'),
('71a2d5b6-b3ed-4e3e-8ee3-df4de802abcf', 'Atividade 2', 'Restrição total ou quase total do acesso à internet, com acompanhamento e supervisão constante.', '', 'fa416055-9b44-420b-b7e2-3ac61c4f13ce'),
('6c4c3a04-cbbc-4f11-bfbb-9f135ab3a5e3', 'Atividade 3', 'Implemente um plano de reabilitação que inclua terapias, atividades sociais e educacionais, e apoio familiar intensivo.', '', 'fa416055-9b44-420b-b7e2-3ac61c4f13ce'),
('a2fa19d7-8ac2-45b2-9c72-24085f498ab2', 'Atividade 4', 'Crie um ambiente que favoreça a interação social e atividades físicas, longe de dispositivos.', '', 'fa416055-9b44-420b-b7e2-3ac61c4f13ce'),
('4b0ae17e-0a2c-4a3a-9f21-cdce8e024bbb', 'Atividade 5', 'Colabore ativamente com a escola para monitorar o comportamento e o desempenho.', '', 'fa416055-9b44-420b-b7e2-3ac61c4f13ce'),
('ceae066a-f020-4a03-9d56-fd395e9929e9', 'Atividade 6', 'Prepare-se para possíveis resistências e trabalhe com a criança e a família para entender a raiz da dependência.', '', 'fa416055-9b44-420b-b7e2-3ac61c4f13ce');

select * from atividade;

ALTER TABLE resultados_questionario
ADD COLUMN faixa_etaria_respondida VARCHAR;
