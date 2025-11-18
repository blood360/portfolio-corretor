const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

// Variáveis de Ambiente e Porta
const PORT = process.env.PORT || 3001;

// A URL de conexão virá das variáveis de ambiente do Render
// Se não tiver variável (local), tenta usar a string local, mas no Render vai usar a variável.
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//##############################################
//          CONFIGURAÇÃO DO MONGOOSE
//##############################################

// Só tenta conectar se tiver a URI (no Render vai ter)
if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ MongoDB Atlas conectado com sucesso!'))
        .catch(err => console.error('❌ Erro ao conectar no MongoDB:', err));
} else {
    console.log('⚠️ MONGODB_URI não definida. O banco não conectará localmente sem ela.');
}

//##############################################
//          MODELOS (SCHEMAS)
//##############################################

const defaultOpts = { timestamps: true };

// 1. COTAÇÕES
const CotacaoSchema = new mongoose.Schema({
    nome: String,
    email: String,
    telefone: String,
    modalidade: String,
    cidade: String,
    bairro: String,
    numPessoas: Number,
    data_envio: { type: Date, default: Date.now },
    // Vidas agora são um array de objetos dentro da cotação (mais fácil no Mongo)
    vidas: [{
        idade: String,
        pre_existente: String,
        doenca: String
    }]
}, defaultOpts);
const Cotacao = mongoose.model('Cotacao', CotacaoSchema);

// 2. ATUALIZAÇÕES
const AtualizacaoSchema = new mongoose.Schema({
    titulo: String,
    descricao: String,
    imagem: String,
    data_publicacao: { type: Date, default: Date.now },
}, defaultOpts);
const Atualizacao = mongoose.model('Atualizacao', AtualizacaoSchema);

// 3. ADMINISTRADORAS (Vamos manter fixo por enquanto ou criar Model se quiser editar depois)
// Para facilitar agora, vamos manter fixo, mas vindo da API.
const administradorasMock = [
    { id: 1, nome: 'Amil', logo: 'logo_amil.png', descricao: 'Planos Nacionais e Regionais.', tabelas_url: '' },
    { id: 2, nome: 'Bradesco Saúde', logo: 'logo_bradesco.png', descricao: 'Focado em planos empresariais.', tabelas_url: '' },
    { id: 3, nome: 'Hapvida', logo: 'logo_hapvida.png', descricao: 'Saúde acessível com ampla rede própria.', tabelas_url: '' },
];

//##############################################
//          ROTAS DA API (COM MONGOOSE)
//##############################################

// POST: NOVA COTAÇÃO
app.post('/api/cotacoes', async (req, res) => {
    try {
        // O frontend manda 'idades' como array, o Schema aceita 'vidas'. Vamos ajustar se precisar.
        // Mas no seu frontend você manda 'idades', então vamos salvar como 'vidas' no banco.
        const { idades, ...resto } = req.body;
        
        const novaCotacao = new Cotacao({
            ...resto,
            vidas: idades // Mapeia idades do front para vidas do banco
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
        // O frontend espera um array. O Mongo devolve array.
        // O frontend espera 'id', o Mongo tem '_id'. O React lida bem, mas podemos mapear.
        const listaFormatada = lista.map(item => ({
            ...item._doc,
            id: item._id, // Cria um campo 'id' igual ao '_id'
            vidas: item.vidas // Já está aninhado
        }));
        res.json(listaFormatada);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar cotações." });
    }
});

// DELETE: APAGAR COTAÇÃO
app.delete('/api/cotacoes/:id', async (req, res) => {
    try {
        await Cotacao.findByIdAndDelete(req.params.id);
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
        await Atualizacao.findByIdAndDelete(req.params.id);
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
//      SERVINDO O FRONTEND
//##############################################
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(FRONTEND_DIR));

app.get('/*', (req, res) => { 
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
    } else {
        res.status(404).json({ error: 'API endpoint não encontrado' });
    }
});

// Inicialização
app.listen(PORT, () => {
    console.log(`🔥 Servidor com MongoDB rodando na porta ${PORT}`);
});