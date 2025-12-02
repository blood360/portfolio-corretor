const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

app.use(cors());
// AUMENTAR O LIMITE PARA ACEITAR IMAGENS BASE64 (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Conexão MongoDB
if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ MongoDB Atlas conectado!'))
        .catch(err => console.error('❌ Erro MongoDB:', err));
}

// SCHEMAS
const defaultOpts = { timestamps: true };

const CotacaoSchema = new mongoose.Schema({
    nome: String, email: String, telefone: String, modalidade: String,
    cidade: String, bairro: String, numPessoas: Number,
    data_envio: { type: Date, default: Date.now },
    vidas: [{ idade: String, pre_existente: String, doenca: String }]
}, defaultOpts);
const Cotacao = mongoose.model('Cotacao', CotacaoSchema);

const AtualizacaoSchema = new mongoose.Schema({
    titulo: String,
    descricao: String,
    imagem: String, // Agora vai guardar o Base64 gigante
    data_publicacao: { type: Date, default: Date.now },
}, defaultOpts);
const Atualizacao = mongoose.model('Atualizacao', AtualizacaoSchema);

// NOVO SCHEMA PARA ADMINISTRADORAS
const AdministradoraSchema = new mongoose.Schema({
    nome: String,
    descricao: String,
    logo: String, // Base64 da Logo
    tabela: String // Base64 da Tabela de Preços
}, defaultOpts);
const Administradora = mongoose.model('Administradora', AdministradoraSchema);

//-- DEPOIMENTOS DOS CLIENTES --
const DepoimentoSchema = new mongoose.Schema({
    nome: String,
    local: String,
    texto: String,
    estrelas: Number,
    aprovado: { type: Boolean, default: false } // <--- NOVIDADE: Nasce falso (pendente)
}, defaultOpts);
const Depoimento = mongoose.model('Depoimento', DepoimentoSchema);

// ROTAS API

// --- Cotações ---
app.post('/api/cotacoes', async (req, res) => {
    try {
        const { idades, ...resto } = req.body;
        const nova = new Cotacao({ ...resto, vidas: idades });
        const salvo = await nova.save();
        res.status(201).json({ message: 'Salvo', cotacaoId: salvo._id });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/cotacoes', async (req, res) => {
    try {
        const lista = await Cotacao.find().sort({ data_envio: -1 });
        res.json(lista.map(i => ({ ...i._doc, id: i._id })));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/cotacoes/:id', async (req, res) => {
    try { await Cotacao.findByIdAndDelete(req.params.id); res.json({ msg: 'OK' }); } 
    catch (e) { res.status(500).json({ error: e.message }); }
});

// --- Atualizações ---
app.get('/api/atualizacoes', async (req, res) => {
    try {
        const lista = await Atualizacao.find().sort({ data_publicacao: -1 });
        res.json(lista.map(i => ({ ...i._doc, id: i._id })));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/atualizacoes', async (req, res) => {
    try {
        const nova = new Atualizacao(req.body);
        await nova.save();
        res.status(201).json({ message: 'Salvo' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/atualizacoes/:id', async (req, res) => {
    try { await Atualizacao.findByIdAndDelete(req.params.id); res.json({ msg: 'OK' }); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/atualizacoes/:id', async (req, res) => {
    try { await Atualizacao.findByIdAndUpdate(req.params.id, req.body); res.json({ msg: 'OK' }); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

// --- Administradoras ---
app.get('/api/administradoras', async (req, res) => {
    try {
        const lista = await Administradora.find();
        res.json(lista.map(i => ({ ...i._doc, id: i._id })));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/administradoras', async (req, res) => {
    try {
        const nova = new Administradora(req.body);
        await nova.save();
        res.status(201).json({ message: 'Administradora Salva' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/administradoras/:id', async (req, res) => {
    try { await Administradora.findByIdAndDelete(req.params.id); res.json({ msg: 'OK' }); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

// -- ROTA PARA DEPOIMENTOS --
app.get('/api/depoimentos/publicos', async (req, res) => {
    try {
        const lista = await Depoimento.find({ aprovado: true }).sort({ createdAt: -1 }).limit(6);
        res.json(lista.map(i => ({ ...i._doc, id: i._id })));
    } catch (e) { res.status(500).json({ error: e.message }); }
});
// ROTA ADMIN (Painel): Traz tudo (aprovados e pendentes)
app.get('/api/depoimentos/todos', async (req, res) => {
    try {
        const lista = await Depoimento.find().sort({ createdAt: -1 });
        res.json(lista.map(i => ({ ...i._doc, id: i._id })));
    } catch (e) { res.status(500).json({ error: e.message }); }
});
// ROTA POST (Cliente envia): Salva como pendente
app.post('/api/depoimentos', async (req, res) => {
    try {
        const nova = new Depoimento({ ...req.body, aprovado: false });
        await nova.save();
        res.status(201).json({ message: 'Recebido para moderação' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});
// ROTA PUT (Admin Aprova): Muda para aprovado = true
app.put('/api/depoimentos/:id/aprovar', async (req, res) => {
    try {
        await Depoimento.findByIdAndUpdate(req.params.id, { aprovado: true });
        res.json({ message: 'Aprovado!' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ROTA DELETE (Admin apaga)
app.delete('/api/depoimentos/:id', async (req, res) => {
    try { await Depoimento.findByIdAndDelete(req.params.id); res.json({ msg: 'OK' }); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

// SERVIR FRONTEND
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(FRONTEND_DIR));
app.get('/*', (req, res) => {
    if (!req.path.startsWith('/api')) res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
    else res.status(404).json({ error: 'API não encontrada' });
});

app.listen(PORT, () => console.log(`🔥 Server ON ${PORT}`));