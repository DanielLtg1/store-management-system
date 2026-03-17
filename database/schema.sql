DROP DATABASE IF EXISTS gestao_lojas;
CREATE DATABASE gestao_lojas;
USE gestao_lojas;

CREATE TABLE atendente (
    id          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(50) NOT NULL UNIQUE,
    senha_hash  VARCHAR(255) NOT NULL,
    ativo       TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE produto_roupa (
    id          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL,
    tamanho     VARCHAR(5),
    genero      CHAR(1),
    preco       DECIMAL(10, 2) NOT NULL,
    quantidade  INT NOT NULL,
    ativo       TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE produto_perfume (
    id          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL,
    tamanho     VARCHAR(5),
    genero      CHAR(1),
    preco       DECIMAL(10, 2) NOT NULL,
    quantidade  INT NOT NULL,
    ativo       TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE condicional (
    id                  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome_cliente        VARCHAR(50) NOT NULL,
    telefone            VARCHAR(15),
    data_condicional    DATE NOT NULL,
    status_condicional  ENUM('aberto', 'encerrado', 'cancelado') NOT NULL DEFAULT 'aberto'
);

CREATE TABLE condicional_item (
    id                  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_condicional      INT NOT NULL,
    id_produto          INT NOT NULL,
    tipo_produto        ENUM('roupa', 'perfume') NOT NULL,
    quantidade_saiu     INT NOT NULL,
    quantidade_devolveu INT NOT NULL DEFAULT 0,
    FOREIGN KEY (id_condicional) REFERENCES condicional(id)
);