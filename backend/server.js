const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const path = require('path');
const { error } = require('console');
//CONFIGURAÇÃO DO EXPRESS
const app = express();
const PORT = process.env.PORT || 3001;

///MIDLEWARES
app.use(cors()); //PARA REQUISIÇÃO DO FRONTEND
app.use(express.json()); //PARA O SERVIDOR LER O JSON

//##############################################
//      CONFIGURAÇÃO DO BANCO DE DADOS
//##############################################
const dbDriver = sqlite3.verbose();
// Garante que o DB fique na raiz do backend ou onde o serviço de deploy espera
const dbPath = path.resolve(__dirname, 'corretor.db');

const db = new dbDriver.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao abrir banco de dados: ' + err.message);
    } else {
        console.log('Banco de dados sqlite3 conectado em: ' + dbPath);

        //CRIAÇÃO DAS TABELAS
        db.run(`CREATE TABLE IF NOT EXISTS cotacoes (
            id INTEGER PRIMARY KEY,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            telefone TEXT NOT NULL,
            modalidade TEXT NOT NULL,
            cidade TEXT NOT NULL,
            bairro TEXT NOT NULL,
            numPessoas INTEGER NOT NULL,
            data_envio TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS vidas (
            id INTEGER PRIMARY KEY,
            cotacao_id INTEGER NOT NULL,
            idade INTEGER NOT NULL,
            pre_existente TEXT NOT NULL,
            doenca TEXT,
            FOREIGN KEY (cotacao_id) REFERENCES cotacoes(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS atualizacoes (
            id INTEGER PRIMARY KEY,
            titulo TEXT NOT NULL,
            descricao TEXT NOT NULL,
            imagem TEXT NOT NULL,
            data_publicacao TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS atualizacoes (
            id INTEGER PRIMARY KEY,
            titulo TEXT NOT NULL,
            descricao TEXT NOT NULL,
            imagem TEXT NOT NULL,
            data_publicacao TEXT NOT NULL
         )`);

        db.run(`CREATE TABLE IF NOT EXISTS administradoras (
            id INTEGER PRIMARY KEY,
            nome TEXT NOT NULL,
            logo TEXT NOT NULL,
            descricao TEXT NOT NULL,
            tabelas_url TEXT
        )`);
    }
});

//##############################################
//                 ROTAS DA API
//##############################################
//teste simples
app.get('/', (req, res) => {
    res.json({message: 'Servidor Backend do corretor Adriano Santos está on PAPAI!'});
});

// Rota POST para salvar a solicitação de cotação
app.post('/api/cotacoes', (req, res) => {
    // ... (LÓGICA DO POST /api/cotacoes - MANTIDA IGUAL) ...
    const { nome, email, telefone, modalidade, cidade, bairro, numPessoas, idades } = req.body;
    if(!idades || idades.length === 0) {
        return res.status(400).json({error: 'É necessário informar os dados de pelomenos uma vida.'});
    }
    const data_envio = new Date().toISOString();
    const sqlCotacao = `INSERT INTO cotacoes (nome, email, telefone, modalidade, cidade, bairro, numPessoas, data_envio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(sqlCotacao, [nome, email, telefone, modalidade, cidade, bairro, numPessoas, data_envio], function(err) {
        if (err) {
            console.error ('Erro ao salvar cotação principal:', err.message);
            return res.status(500).json({error: 'Erro ao salvar cotação principal'});
        }
        const cotacaoId = this.lastID;
        const sqlVida = `INSERT INTO vidas (cotacao_id, idade, pre_existente, doenca) VALUES(?, ?, ?, ?)`;

        idades.forEach(vida => {
            db.run(sqlVida, [cotacaoId, vida.idade, vida.preExistente, vida.doenca || null], (err) => {
                if (err) {
                    console.error(`Erro ao salvar vida ${vida.id} para cotação ${cotacaoId}:`, err.message);
                }
            });
        });

        res.status(201).json({ message: "Cotação salva com sucesso!", cotacaoId: cotacaoId });
    });
});

// ### Rota GET para buscar todas as cotações com detalhes das vidas ###
app.get('/api/cotacoes', (req, res) => {
    const sql = `
        SELECT c.id AS cotacao_id, c.nome, c.email, c.telefone, c.modalidade, c.cidade, c.bairro, c.numPessoas, c.data_envio,
               v.id AS vida_id, v.idade, v.pre_existente, v.doenca
        FROM cotacoes c LEFT JOIN vidas v ON c.id = v.cotacao_id ORDER BY c.data_envio DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("ERRO GRAVE ao buscar cotações:", err.message);
            return res.status(500).json({ error: 'Erro interno ao buscar cotações.', detail: err.message });
        }
        const cotacoesMap = {};
        rows.forEach(row => {
            const cotacao_id = row.cotacao_id;
            if (!cotacoesMap[cotacao_id]) {
                cotacoesMap[cotacao_id] = { id: row.cotacao_id, nome: row.nome, email: row.email, telefone: row.telefone, modalidade: row.modalidade, cidade: row.cidade, bairro: row.bairro, numPessoas: row.numPessoas, data_envio: row.data_envio, vidas: [] };
            }
            if (row.vida_id) {
                cotacoesMap[cotacao_id].vidas.push({ id: row.vida_id, idade: row.idade, pre_existente: row.pre_existente, doenca: row.doenca });
            }
        });
        res.json(Object.values(cotacoesMap));
    });
});

// ### Rota GET para buscar atualizações ###
app.get('/api/atualizacoes', (req, res) => {
    const sql = "SELECT id, titulo, descricao, imagem, data_publicacao FROM atualizacoes ORDER BY data_publicacao DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("erro ao buscar atualizações:", err.message);
            return res.status(500).json({error: "Erro ao buscar as atualizações do banco de dados."});
        }
        res.json(rows);
    });
});

// ### Rota para buscar todas as administradoras ###
app.get('/api/administradoras', (req, res) => {
    const sql = 'SELECT id, nome, logo, descricao, tabelas_url FROM administradoras ORDER BY nome ASC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar administradoras:', err.message);
            return res.status(500).json({error: 'Erro ao buscar administradoras do banco de dados;'});
        }
        res.json(rows);
    });
});

// ### Rota POST para adicionar atualização ###
app.post('/api/atualizacoes', (req, res) => {
    const { titulo, descricao, imagem } = req.body;
    if (!titulo || !descricao || !imagem) {
        return res.status(400).json({ error: 'Título, descrição e imagem são campos obrigatórios.' });
    }
    const data_publicacao = new Date().toISOString();
    const sql = `INSERT INTO atualizacoes (titulo, descricao, imagem, data_publicacao) VALUES (?, ?, ?, ?)`;
    db.run(sql, [titulo, descricao, imagem, data_publicacao], function(err) {
        if (err) {
            console.error("Erro ao inserir nova atualização:", err.message);
            return res.status(500).json({ error: 'Erro ao salvar a atualização no banco de dados.' });
        }
        res.status(201).json({ message: 'Atualização adicionada com sucesso!', id: this.lastID });
    });
});

// ### Rota PUT para editar atualização ###
app.put('/api/atualizacoes/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, descricao } = req.body;
    if (!titulo || !descricao) {
        return res.status(400).json({ error: 'Título e descrição são obrigatórios para a edição.' });
    }
    const data_atualizacao = new Date().toISOString();
    const sql = `UPDATE atualizacoes SET titulo = ?, descricao = ?, data_atualizacao = ? WHERE id = ?`;

    db.run(sql, [titulo, descricao, data_atualizacao, id], function(err) {
        if (err) {
            console.error(`Erro ao editar atualização ID ${id}:`, err.message);
            return res.status(500).json({ error: 'Erro ao editar a atualização.' });
        }
        if (this.changes > 0) {
            res.json({ message: `Atualização ID ${id} editada com sucesso!` });
        } else {
            res.status(404).json({ error: `Atualização ID ${id} não encontrada.` });
        }
    });
});

// ### Rota DELETE para remover atualização ###
app.delete('/api/atualizacoes/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM atualizacoes WHERE id = ?`;

    db.run(sql, id, function(err) {
        if (err) {
            console.error(`Erro ao deletar atualização ID ${id}:`, err.message);
            return res.status(500).json({ error: 'Erro ao remover a atualização.' });
        }
        if (this.changes > 0) {
            res.json({ message: `Atualização ID ${id} removida com sucesso!` });
        } else {
            res.status(404).json({ error: `Atualização ID ${id} não encontrada.` });
        }
    });
});

// ### Rota DELETE para remover cotação ###
app.delete('/api/cotacoes/:id', (req, res) => {
    const { id } = req.params;

    const sqlDeleteVidas = `DELETE FROM vidas WHERE cotacao_id = ?`;
    db.run(sqlDeleteVidas, id, (err) => {
        if (err) {
            console.error(`Erro ao deletar vidas para cotação ID ${id}:`, err.message);
        }
        const sqlDeleteCotacao = `DELETE FROM cotacoes WHERE id = ?`;
        db.run(sqlDeleteCotacao, id, function(err) {
            if (err) {
                console.error(`Erro ao deletar cotação ID ${id}:`, err.message);
                return res.status(500).json({ error: 'Erro ao remover a cotação principal.' });
            }
            if (this.changes > 0) {
                res.json({ message: `Cotação ID ${id} e vidas relacionadas removidas com sucesso!` });
            } else {
                res.status(404).json({ error: `Cotação ID ${id} não encontrada.` });
            }
        });
    });
});


//##############################################
//      SERVINDO O FRONTEND (ESTÁTICOS)
//##############################################
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(FRONTEND_DIR));
app.get('/*', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});


//##############################################
//      INICIALIZAÇÃO DO SERVIDOR
//##############################################
app.listen(PORT, () => {
    console.log(`Servidor brabo do Adriano rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
    if (process.env.PORT) {
        console.log(`(Em produção, a porta é ${process.env.PORT})`);
    }
});