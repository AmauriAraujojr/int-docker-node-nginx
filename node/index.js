const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 8180;

const db_ass = {
    host: 'my-sql',
    user: 'root',
    password: 'root',
    database: 'mysql'
};

// Função para tentar conectar ao MySQL com retry
const tryConnect = (retries = 5, delay = 3000) => {
    return new Promise((resolve, reject) => {
        const pool = mysql.createPool(db_ass);
        pool.query('SELECT 1', (err, results) => {
            if (err) {
                if (retries > 0) {
                    console.log(`Tentando conectar ao MySQL... Tentativas restantes: ${retries}`);
                    setTimeout(() => resolve(tryConnect(retries - 1, delay)), delay);
                } else {
                    reject('Não foi possível conectar ao MySQL após várias tentativas.');
                }
            } else {
                resolve(pool);
            }
        });
    });
};

// Tenta se conectar ao MySQL
tryConnect().then((pool) => {
    console.log('Conectado ao MySQL com sucesso!');

    // Rota para inserir dados
    const sqlInsert = `INSERT INTO people(name) VALUES('Amauri Jr')`;

    pool.query(sqlInsert, (err) => {
        if (err) {
            console.error("Erro ao inserir dados:", err);
        }
    });

    // Rota para exibir os dados
    app.get("/", (req, res) => {
        const sqlNames = `SELECT * FROM people`;

        pool.query(sqlNames, (err, results) => {
            if (err) {
                console.error("Erro ao executar a consulta:", err);
                return res.status(500).send("Erro ao acessar o banco de dados");
            }

            const names = results;
            let responseHTML = '<h1>Full Cycle Rocks!</h1><h1>Lista de Pessoas</h1><ul>';
            names.forEach((person) => {
                responseHTML += `<li>${person.name}</li>`;
            });
            responseHTML += '</ul>';

            res.send(responseHTML);
        });
    });

    // Iniciando o servidor
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });

}).catch((err) => {
    console.error('Erro ao conectar ao MySQL:', err);
    process.exit(1);
});
