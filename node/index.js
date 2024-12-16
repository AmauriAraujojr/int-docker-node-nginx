const express = require('express');
const mysql = require('mysql2');

const port = 8180;
const app = express();

const db_ass = {
    host: 'my-sql',
    user: 'root',
    password: 'root',
    database: 'mysql'
};

const pool = mysql.createPool(db_ass);

const sqlInsert = `INSERT INTO people(name) VALUES('Amauri Jr')`;

pool.query(sqlInsert, (err) => {
    if (err) {
        console.error("Erro ao inserir dados:", err);
    }
});

app.get("/", (req, res) => {
    const sqlNames = `SELECT * FROM people`;

    pool.query(sqlNames, (err, results) => {
        if (err) {
            console.error("Erro ao executar a consulta:", err);
            return res.status(500).send("Erro ao acessar o banco de dados");
        }

        // Armazenando os resultados da consulta na variável 'names'
        const names = results;

        // Montando o HTML de resposta com a lista de pessoas
        let responseHTML = '<h1>Full Cycle Rocks!</h1><h1>Lista de Pessoas</h1><ul>';
        names.forEach((person) => {
            responseHTML += `<li>${person.name}</li>`;  // Exibe o nome de cada pessoa
        });
        responseHTML += '</ul>';

        // Enviando o HTML gerado como resposta
        res.send(responseHTML);
    });
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
