CREATE DATABASE devas_financas;

DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios(
	id SERIAL PRIMARY KEY,
  	nome TEXT NOT NULL,
  	email TEXT NOT NULL CONSTRAINT email_usuario UNIQUE,
  	senha TEXT NOT NULL,
	cpf VARCHAR(11) CONSTRAINT cpf_usuario UNIQUE,
  	telefone TEXT
);

DROP TABLE IF EXISTS clientes;

CREATE TABLE clientes(
	id SERIAL PRIMARY KEY,
  	nome TEXT NOT NULL,
  	email TEXT NOT NULL CONSTRAINT email_cliente UNIQUE,
  	cpf VARCHAR(11) NOT NULL CONSTRAINT cpf_cliente UNIQUE,
  	telefone TEXT NOT NULL,
  	status TEXT,
  	cep TEXT,
  	endereco TEXT,
  	complemento TEXT,
  	bairro TEXT,
  	cidade TEXT,
  	uf VARCHAR(2) 
);

DROP TABLE IF EXISTS cobrancas;

CREATE TABLE cobrancas(
	id SERIAL PRIMARY KEY,
  	cliente_id INT NOT NULL references clientes(id),
  	descricao TEXT NOT NULL,
  	status TEXT NOT NULL,
  	valor DEC NOT NULL,
  	vencimento DATE NOT NULL  	
);

