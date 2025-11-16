// backend/server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

// Variáveis de Ambiente e Porta
const PORT = process.env.PORT || 3001;
// A URL de conexão do MongoDB Atlas será lida da variável de ambiente MONGODB_URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/corretor_db';

const app = express();

// Configuração do CORS (para permitir comunicação local)
app.use(cors());

// Middleware para processar JSON e URLs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//##############################################
//          CONFIGURAÇÃO DO MONGOOSE
//##############################################

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Banco de dados MongoDB Atlas conectado com sucesso!');
    })
    .catch(err => {
        console.error('❌ Erro de conexão com o MongoDB Atlas:', err);
    });

//##############################################
//          DEFINIÇÃO DOS ESQUEMAS (MODELS)
//##############################################

// Esquema Comum (para todos os documentos)
const defaultSchemaOptions = { 
    timestamps: true // Adiciona createdAt e updatedAt
};

// 1. COTAÇÕES
const CotacaoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    telefone: { type: String, required: true },
    email: { type: String, required: false },
    vidas: { type: Number, required: true },
    plano_tipo: { type: String, required: true },
    data_envio: { type: Date, default: Date.now },
}, defaultSchemaOptions);
const Cotacao = mongoose.model('Cotacao', CotacaoSchema);

// 2. VIDAS (Não possui rotas CRUD no projeto atual, mas mantemos o esquema)
const VidaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    idade: { type: Number, required: true },
}, defaultSchemaOptions);
const Vida = mongoose.model('Vida', VidaSchema);

// 3. ATUALIZAÇÕES / NOVIDADES
const AtualizacaoSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    imagem: { type: String, required: true },
    data_publicacao: { type: Date, default: Date.now },
}, defaultSchemaOptions);
const Atualizacao = mongoose.model('Atualizacao', AtualizacaoSchema);

// 4. ADMINISTRADORAS
const AdministradoraSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    logo: { type: String, required: true },
    descricao: { type: String, required: true },
    tabelas_url: { type: String, required: false },
}, defaultSchemaOptions);
const Administradora = mongoose.model('Administradora', AdministradoraSchema);


//##############################################
//          ROTAS DA API (Mongoose)
//##############################################

// ### ROTA POST: NOVA COTAÇÃO (SUBSTITUI O DB.RUN DO SQLITE) ###
app.post('/api/cotacoes', async (req, res) => {
    try {
        const novaCotacao = new Cotacao(req.body);
        const cotacaoSalva = await novaCotacao.save();
        res.status(201).json({ 
            message: 'Cotação enviada e salva no MongoDB com sucesso!', 
            data: cotacaoSalva 
        });
    } catch (error) {
        console.error("Erro ao salvar cotação no MongoDB:", error.message);
        res.status(500).json({ error: "Erro ao salvar cotação no banco de dados." });
    }
});

// ### ROTA GET: BUSCAR COTAÇÕES (SUBSTITUI O DB.ALL DO SQLITE) ###
app.get('/api/cotacoes', async (req, res) => {
    try {
        const cotacoes = await Cotacao.find().sort({ data_envio: -1 });
        res.json(cotacoes);
    } catch (error) {
        console.error("Erro ao buscar cotações:", error.message);
        res.status(500).json({ error: "Erro ao buscar cotações do banco de dados." });
    }
});

// ### ROTA GET: BUSCAR ATUALIZAÇÕES (SUBSTITUI O DB.ALL DO SQLITE) ###
app.get('/api/atualizacoes', async (req, res) => {
    try {
        // Busca 3 atualizações e ordena pela data mais recente
        const atualizacoes = await Atualizacao.find().sort({ data_publicacao: -1 }).limit(3);
        res.json(atualizacoes);
    } catch (error) {
        console.error("Erro ao buscar atualizações:", error.message);
        res.status(500).json({ error: "Erro ao buscar atualizações do banco de dados." });
    }
});

// ### ROTA GET: BUSCAR ADMINISTRADORAS (SUBSTITUI O DB.ALL DO SQLITE) ###
app.get('/api/administradoras', async (req, res) => {
    try {
        const administradoras = await Administradora.find().sort({ nome: 1 });
        res.json(administradoras);
    } catch (error) {
        console.error("Erro ao buscar administradoras:", error.message);
        res.status(500).json({ error: "Erro ao buscar administradoras do banco de dados." });
    }
});

// Rotas POST/PUT/DELETE para o ADMIN (atualizacoes e administradoras) seriam adicionadas aqui,
// mas para o portfólio, mantemos apenas o GET para busca.


//##############################################
//      SERVINDO O FRONTEND (ESTÁTICOS)
//##############################################

// Configura o caminho para a pasta 'dist' (já corrigido para o deploy)
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend', 'dist');

// Servir os arquivos estáticos
app.use(express.static(FRONTEND_DIR));

// Para qualquer rota que não seja da API, serve o index.html do React
app.get('/*', (req, res) => { 
    // Garante que a rota coringa funcione para o Express
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
    } else {
        // Se for /api, mas não foi encontrada acima (ex: /api/naoexiste), retorna 404.
        res.status(404).json({ error: 'Endpoint da API não encontrado.' });
    }
});


//##############################################
//      INICIALIZAÇÃO DO SERVIDOR
//##############################################
app.listen(PORT, () => {
    console.log(`Servidor brabo do Adriano rodando na porta ${PORT}`);
    if (process.env.PORT) {
        console.log(`(Em produção, a porta é ${process.env.PORT})`);
    } else {
        console.log(`Acesse localmente: http://localhost:${PORT}`);
    }
});