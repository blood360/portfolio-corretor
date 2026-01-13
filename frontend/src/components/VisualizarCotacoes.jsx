import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';

const VisualizarCotacoes = () => {
    const [cotacoes, setCotacoes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Busca as cotações no Backend
    const fetchCotacoes = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/cotacoes');
            if (res.ok) setCotacoes(await res.json());
        } catch (error) {
            console.error("Erro ao buscar cotações:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCotacoes(); }, []);

    // Função para mudar o Status (Funil de Vendas)
    const updateStatus = async (id, novoStatus) => {
        // Atualiza visualmente na hora (otimista)
        setCotacoes(prev => prev.map(c => c.id === id ? { ...c, status: novoStatus } : c));

        // Manda pro servidor
        await fetch(`/api/cotacoes/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: novoStatus })
        });
    };

    const handleDelete = async (id) => {
        if(confirm('Tem certeza que deseja apagar este lead permanentemente?')) {
            await fetch(`/api/cotacoes/${id}`, { method: 'DELETE' });
            fetchCotacoes();
        }
    };

    // Cores para os Status (Etiquetas visuais)
    const getStatusColor = (status) => {
        switch(status) {
            case 'Novo': return '#ffc107'; // Amarelo (Atenção)
            case 'Cotando': return '#17a2b8'; // Azul (Trabalhando)
            case 'Cotação Enviada': return '#6f42c1'; // Roxo (Esperando Cliente)
            case 'Aguardando Resposta': return '#fd7e14'; // Laranja (Quase lá)
            case 'Fechou': return '#28a745'; // Verde (Sucesso!)
            case 'Não Fechou': return '#6c757d'; // Cinza (Arquivo)
            default: return '#333';
        }
    };

    if (loading) return <p>Carregando leads...</p>;

    return (
        <div>
            <h3 style={{color: '#0056b3', marginBottom: '20px'}}>Gestão de Leads e Cotações</h3>
            <button onClick={fetchCotacoes} className="refresh-btn" style={{marginBottom: '20px'}}>🔄 Atualizar Lista</button>

            {/* TABELA DE LEADS (VISÃO GERAL) */}
            <div className="admin-list-card" style={{marginBottom: '30px', overflowX: 'auto'}}>
                <h4>📋 Resumo dos Últimos Leads</h4>
                {cotacoes.length === 0 ? <p>Nenhum lead encontrado.</p> : (
                    <table style={{width: '100%', borderCollapse: 'collapse', minWidth: '600px', fontSize: '0.9rem'}}>
                        <thead>
                            <tr style={{background: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #ddd'}}>
                                <th style={{padding: '10px'}}>Data</th>
                                <th style={{padding: '10px'}}>Nome</th>
                                <th style={{padding: '10px'}}>Tipo</th>
                                <th style={{padding: '10px'}}>Vidas</th>
                                <th style={{padding: '10px'}}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cotacoes.slice(0, 10).map(c => (
                                <tr key={c.id} style={{borderBottom: '1px solid #eee'}}>
                                    <td style={{padding: '10px'}}>{new Date(c.createdAt || c.data_envio).toLocaleDateString()}</td>
                                    <td style={{padding: '10px', fontWeight: 'bold'}}>{c.nome}</td>
                                    <td style={{padding: '10px'}}>{c.tipo || c.modalidade || 'PF'}</td>
                                    <td style={{padding: '10px'}}>{c.vidas || c.numPessoas || 1}</td>
                                    <td style={{padding: '10px'}}>
                                        <span style={{
                                            backgroundColor: getStatusColor(c.status || 'Novo'), 
                                            color: 'white', 
                                            padding: '3px 8px', 
                                            borderRadius: '10px', 
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {c.status || 'Novo'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* CARDS DETALHADOS (PARA TRABALHAR) */}
            <h4>🔍 Detalhes para Trabalhar (Funil)</h4>
            <div className="cotacoes-grid">
                {cotacoes.map(c => (
                    <div key={c.id} className="admin-card-lead" style={{
                        borderLeft: `5px solid ${getStatusColor(c.status || 'Novo')}`,
                        background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px'
                    }}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                            <strong style={{fontSize: '1.1rem'}}>{c.nome}</strong>
                            <small style={{color: '#666'}}>{new Date(c.createdAt || c.data_envio).toLocaleString()}</small>
                        </div>
                        
                        {/* SELETOR DE STATUS (FUNIL) */}
                        <div style={{background: '#f1f3f5', padding: '10px', borderRadius: '5px', marginBottom: '15px'}}>
                            <label style={{fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>STATUS DO LEAD:</label>
                            <select 
                                value={c.status || 'Novo'} 
                                onChange={(e) => updateStatus(c.id, e.target.value)}
                                style={{width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', fontWeight: 'bold'}}
                            >
                                <option value="Novo">🌟 Novo Lead</option>
                                <option value="Cotando">⚙️ Cotando</option>
                                <option value="Cotação Enviada">📨 Cotação Enviada</option>
                                <option value="Aguardando Resposta">⏳ Aguardando Resposta</option>
                                <option value="Fechou">✅ Venda Realizada! (Fechou)</option>
                                <option value="Não Fechou">❌ Arquivado (Não Fechou)</option>
                            </select>
                        </div>

                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem', marginBottom: '15px'}}>
                            <p><strong>📞 Tel:</strong> {c.telefone}</p>
                            <p><strong>📧 Email:</strong> {c.email || '-'}</p>
                            <p><strong>🏥 Tipo:</strong> {c.tipo || c.modalidade || 'PF'}</p>
                            <p><strong>👥 Vidas:</strong> {c.vidas || c.numPessoas || 1}</p>
                            {c.cnpj && <p style={{gridColumn: 'span 2'}}><strong>🏢 CNPJ:</strong> {c.cnpj}</p>}
                        </div>
                        
                        {c.mensagem && (
                            <div style={{background: '#fff3cd', padding: '10px', borderRadius: '5px', marginBottom: '15px', borderLeft: '3px solid #ffc107'}}>
                                <small>💬 Mensagem do Cliente:</small>
                                <p style={{margin: 0, fontStyle: 'italic'}}>"{c.mensagem}"</p>
                            </div>
                        )}

                        <div style={{display: 'flex', gap: '10px'}}>
                            <a 
                                href={`https://wa.me/55${c.telefone.replace(/\D/g,'')}`} 
                                target="_blank" 
                                rel="noreferrer"
                                style={{flex: 1, backgroundColor: '#25d366', color: 'white', textDecoration: 'none', padding: '10px', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold'}}
                            >
                                📱 Chamar no WhatsApp
                            </a>
                            <button 
                                onClick={() => handleDelete(c.id)} 
                                style={{backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer'}}
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisualizarCotacoes;