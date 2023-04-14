

CREATE DATABASE likeme;

\c likeme

CREATE TABLE post (
    id SERIAL,
    titulo VARCHAR(25),
    img VARCHAR(1000),
    descripcion VARCHAR(255),
    likes INT
);  