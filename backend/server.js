const express = require('express');
const path = require('path');
const cors = require('cors');

// Simulação do Banco de Dados (Dados em Memória)
let cotacoesMock = [];
let atualizacoesMock = [
    { id: 1, titulo: 'Novos Planos da Hapvida!', descricao: 'Tabelas 2026 já disponíveis. Consulte!', imagem: 'checkup.jpg', data_publicacao: new Date().toISOString() },
    {id: 2, titulo: 'FIQUE ATENTO', descricao: 'aos novos números de entrevistas médicas da Nova Saúde! confira no card!', imagem: 'fique_atento.jpg', data_publicacao: new Date().toISOString()},
];

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//##############################################
//          ROTAS DA API (MOCKADAS)
//##############################################

// ROTA POST: NOVA COTAÇÃO (Salva no array)
app.post('/api/cotacoes', (req, res) => {
    const novaCotacao = {
        id: Date.now(), // ID temporário
        ...req.body,
        data_envio: new Date().toISOString()
    };
    cotacoesMock.push(novaCotacao);
    console.log(`Nova cotação recebida: ${novaCotacao.nome}`);

    // Como o frontend espera um ID, retornamos um mock.
    res.status(201).json({ 
        message: 'Cotação salva temporariamente!', 
        cotacaoId: novaCotacao.id 
    });
});

// ROTA GET: BUSCAR COTAÇÕES (Retorna o array em memória)
app.get('/api/cotacoes', (req, res) => {
    // Retorna as cotações salvas em memória
    res.json(cotacoesMock.reverse()); 
});

// ROTA GET: BUSCAR ATUALIZAÇÕES (Retorna dados mockados)
app.get('/api/atualizacoes', (req, res) => {
    // Retorna dados fixos
    res.json(atualizacoesMock);
});

// ROTA GET: BUSCAR ADMINISTRADORAS (Retorna dados mockados)
app.get('/api/administradoras', (req, res) => {
    const administradorasMock = [
        { id: 1, nome: 'plano Adesão', logo: 'tabela_adesao.png', descricao: 'Confira os valores promocionais dos plano PF.' },
        { id: 2, nome: 'Bradesco Saúde', logo: 'logo_bradesco.png', descricao: 'Planos empresariais.' },
    ];
    res.json(administradorasMock);
});

// Rota DELETE para remover uma cotação (Simulação de exclusão do array)
app.delete('/api/cotacoes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = cotacoesMock.length;
    cotacoesMock = cotacoesMock.filter(c => c.id !== id);

    if (cotacoesMock.length < initialLength) {
        res.json({ message: `Cotação ID ${id} removida da memória.` });
    } else {
        res.status(404).json({ error: `Cotação ID ${id} não encontrada na memória.` });
    }
});


//##############################################
//      SERVINDO O FRONTEND (ESTÁTICOS)
//##############################################

const FRONTEND_DIR = path.join(__dirname, '..', 'frontend', 'dist');

app.use(express.static(FRONTEND_DIR));

app.get('/*', (req, res) => { 
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
    } else {
        res.status(404).json({ error: 'Endpoint da API não encontrado.' });
    }
});


//##############################################
//      INICIALIZAÇÃO DO SERVIDOR
//##############################################
app.listen(PORT, () => {
    console.log(`Servidor brabo do Adriano rodando na porta ${PORT}`);
});