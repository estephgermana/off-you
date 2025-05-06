-- usuario
CREATE TABLE usuario (
id_usuario SERIAL PRIMARY KEY,
nome VARCHAR(300) NOT NULL,
email VARCHAR(250) NOT NULL,
senha VARCHAR(100) NOT NULL,
tipo_usuario VARCHAR(50) NOT NULL,
data_cadastro DATE DEFAULT CURRENT_DATE,
data_nascimento DATE DEFAULT NULL,
pontos INT DEFAULT 0
);

-- Tipo de Plano de Ação
CREATE TABLE tipo_plano_acao (
id_tipo_plano SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
descricao VARCHAR(500)
);

-- Questionário
CREATE TABLE questionario (
id_questionario SERIAL PRIMARY KEY,
titulo VARCHAR(200) NOT NULL,
descricao VARCHAR(500) NOT NULL
);

-- Pergunta
CREATE TABLE pergunta (
id_pergunta SERIAL PRIMARY KEY,
id_questionario INT REFERENCES questionario(id_questionario),
descricao_pergunta VARCHAR(500) NOT NULL,
tipo_resposta VARCHAR(100) NOT NULL
);

-- Plano de Ação
CREATE TABLE plano_de_acao (
id_plano SERIAL PRIMARY KEY,
id_usuario INT REFERENCES usuario(id_usuario),
id_tipo_plano INT REFERENCES tipo_plano_acao(id_tipo_plano),
data_inicio DATE NOT NULL,
data_fim DATE NOT NULL
);

-- Atividade
CREATE TABLE atividade (
id_atividade SERIAL PRIMARY KEY,
titulo VARCHAR(200) NOT NULL,
descricao VARCHAR(500) NOT NULL,
tipo VARCHAR(100) NOT NULL
);

-- Atividade no Plano de Ação
CREATE TABLE atividade_plano (
id_plano INT REFERENCES plano_de_acao(id_plano),
id_atividade INT REFERENCES atividade(id_atividade),
status VARCHAR(100) NOT NULL,
observacoes VARCHAR(500) NOT NULL,
data_conclusao DATE NOT NULL,
PRIMARY KEY (id_plano, id_atividade)
);

-- Resposta
CREATE TABLE resposta (
id_resposta SERIAL PRIMARY KEY,
id_pergunta INT REFERENCES pergunta(id_pergunta),
id_usuario INT REFERENCES usuario(id_usuario),
resposta_usuario VARCHAR(500) NOT NULL
);

-- Diário da Atividade
CREATE TABLE diario_atividade (
id_diario SERIAL PRIMARY KEY,
id_plano INT,
id_atividade INT,
id_usuario INT REFERENCES usuario(id_usuario),
entrada_diario VARCHAR(800) NOT NULL,
data_registro DATE DEFAULT CURRENT_DATE,
FOREIGN KEY (id_plano, id_atividade) REFERENCES atividade_plano(id_plano, id_atividade)
);

-- Conquista
CREATE TABLE conquista (
id_conquista SERIAL PRIMARY KEY,
id_usuario INT REFERENCES usuario(id_usuario),
descricao VARCHAR(500) NOT NULL,
data_conquista DATE NOT NULL,
quantidade_estrelas INT NOT NULL
);