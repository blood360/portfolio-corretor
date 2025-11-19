const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');

// Para carregar variáveis de ambiente localmente em ambiente não produção
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Variáveis de Ambiente e Porta
const PORT = process.env.PORT || 3001;

// URI MongoDB (do Render ou .env local)
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//##############################################
//          CONFIGURAÇÃO DO MONGOOSE
//##############################################

// Conecta e só inicia o servidor se der certo
if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => {
            console.log('✅ MongoDB Atlas conectado com sucesso!');

            // Inicializar servidor só após conexão com sucesso
            app.listen(PORT, () => {
                console.log(`🔥 Servidor com MongoDB rodando na porta ${PORT}`);
            });
        })
        .catch(err => {
            console.error('❌ Erro ao conectar no MongoDB:', err);
            process.exit(1); // Encerra app se não conectar ao banco
        });
} else {
    console.log('⚠️ MONGODB_URI não definida. O banco não conectará localmente sem ela.');

    // Opcional: Inicia servidor mesmo sem banco, mas pode ter rotas mock ou limitações
    app.listen(PORT, () => {
        console.log(`🔥 Servidor rodando na porta ${PORT} (sem MongoDB)`);
    });
}

//##############################################
//          MODELOS (SCHEMAS)
//##############################################

const defaultOpts = { timestamps: true };

// Schema Cotacao com validações básicas
const CotacaoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefone: String,
    modalidade: String,
    cidade: String,
    bairro: String,
    numPessoas: Number,
    data_envio: { type: Date, default: Date.now },
    vidas: [{
        idade: String,
        pre_existente: String,
        doenca: String
    }]
}, defaultOpts);
const Cotacao = mongoose.model('Cotacao', CotacaoSchema);

// Schema Atualizacao com validações básicas
const AtualizacaoSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    imagem: String,
    data_publicacao: { type: Date, default: Date.now },
}, defaultOpts);
const Atualizacao = mongoose.model('Atualizacao', AtualizacaoSchema);

// Administradoras fixas (mock)
const administradorasMock = [
    { id: 1, nome: 'Amil', logo: 'logo_amil.png', descricao: 'Planos Nacionais e Regionais.', tabelas_url: '' },
    { id: 2, nome: 'Bradesco Saúde', logo: 'logo_bradesco.png', descricao: 'Focado em planos empresariais.', tabelas_url: '' },
    { id: 3, nome: 'Hapvida', logo: 'logo_hapvida.png', descricao: 'Saúde acessível com ampla rede própria.', tabelas_url: '' },
];

//##############################################
//          ROTAS DA API (COM MONGOOSE)
//##############################################

// POST: NOVA COTAÇÃO
app.post('/api/cotacoes', async (req, res) => {
    try {
        const { idades, ...resto } = req.body;

        // Validação básica simples
        if (!resto.nome || !resto.email) {
            return res.status(400).json({ error: "Campos nome e email são obrigatórios." });
        }

        const novaCotacao = new Cotacao({
            ...resto,
            vidas: Array.isArray(idades) ? idades : []
        });

        const salvo = await novaCotacao.save();

        res.status(201).json({
            message: 'Cotação salva no MongoDB!',
            cotacaoId: salvo._id
        });
    } catch (error) {
        console.error("Erro Mongo:", error);
        res.status(500).json({ error: "Erro ao salvar no banco." });
    }
});

// GET: BUSCAR COTAÇÕES
app.get('/api/cotacoes', async (req, res) => {
    try {
        const lista = await Cotacao.find().sort({ data_envio: -1 });

        const listaFormatada = lista.map(item => ({
            ...item._doc,
            id: item._id,
            vidas: item.vidas
        }));

        res.json(listaFormatada);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar cotações." });
    }
});

// DELETE: APAGAR COTAÇÃO
app.delete('/api/cotacoes/:id', async (req, res) => {
    try {
        const deleted = await Cotacao.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Cotação não encontrada" });
        res.json({ message: 'Cotação deletada.' });
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar." });
    }
});

// GET: ATUALIZAÇÕES
app.get('/api/atualizacoes', async (req, res) => {
    try {
        const lista = await Atualizacao.find().sort({ data_publicacao: -1 });
        const listaFormatada = lista.map(item => ({ ...item._doc, id: item._id }));
        res.json(listaFormatada);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar atualizações." });
    }
});

// POST: NOVA ATUALIZAÇÃO
app.post('/api/atualizacoes', async (req, res) => {
    try {
        const nova = new Atualizacao(req.body);
        const salvo = await nova.save();
        res.status(201).json({ message: 'Salvo!', id: salvo._id });
    } catch (error) {
        res.status(500).json({ error: "Erro ao salvar atualização." });
    }
});

// PUT: EDITAR ATUALIZAÇÃO
app.put('/api/atualizacoes/:id', async (req, res) => {
    try {
        await Atualizacao.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: 'Atualizado!' });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar." });
    }
});

// DELETE: REMOVER ATUALIZAÇÃO
app.delete('/api/atualizacoes/:id', async (req, res) => {
    try {
        const removed = await Atualizacao.findByIdAndDelete(req.params.id);
        if (!removed) return res.status(404).json({ error: "Atualização não encontrada" });
        res.json({ message: 'Removido!' });
    } catch (error) {
        res.status(500).json({ error: "Erro ao remover." });
    }
});

// GET: ADMINISTRADORAS (Mantendo Mock por enquanto)
app.get('/api/administradoras', (req, res) => {
    res.json(administradorasMock);
});

//##############################################
//      SERVINDO O FRONTEND (SPA)
//##############################################
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend', 'dist');

if (fs.existsSync(FRONTEND_DIR)) {
    app.use(express.static(FRONTEND_DIR));
} else {
    console.warn('⚠️ Diretório frontend/dist não encontrado, está disponível para servir?');
}

app.get('/*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
    } else {
        res.status(404).json({ error: 'API endpoint não encontrado' });
    }
});
