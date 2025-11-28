import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';

const API_URL_BASE = '/api/cotacoes'; 

const VisualizarCotacoes = () => {
    const [cotacoes, setCotacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para o Modal de Detalhes
    const [modalAberto, setModalAberto] = useState(false);
    const [cotacaoSelecionada, setCotacaoSelecionada] = useState(null);

    // Função de fetch
    const fetchCotacoes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL_BASE); 
            if (response.ok) {
                const data = await response.json();
                setCotacoes(data);
            } else {
                setError(`Erro ao carregar dados. Status: ${response.status}`);
            }
        } catch (err) {
            setError('Erro de conexão com o backend. Verifique se o serviço Express está rodando.');
        } finally {
            setLoading(false);
        }
    };

    // Função para abrir o modal com os detalhes
    const handleVerDetalhes = (cotacao) => {
        setCotacaoSelecionada(cotacao);
        setModalAberto(true);
    };

    // Função para fechar o modal
    const fecharModal = () => {
        setModalAberto(false);
        setCotacaoSelecionada(null);
    };

    // Função para deletar
    const handleDelete = async (cotacaoId) => {
        if (!window.confirm(`Tem certeza que deseja DELETAR a cotação ID ${cotacaoId}?`)) {
            return;
        }
        try {
            const response = await fetch(`${API_URL_BASE}/${cotacaoId}`, { method: 'DELETE' });
            if (response.ok) {
                alert(`Cotação deletada com sucesso!`);
                fetchCotacoes(); 
            } else {
                alert('Erro ao deletar.');
            }
        } catch (error) {
            alert('Erro de conexão ao tentar deletar.');
        }
    };
    
    useEffect(() => {
        fetchCotacoes();
    }, []);

    if (loading) return <p>Carregando cotações...</p>;
    if (error) return <p className="error-message">❌ {error}</p>;

    return (
        <div className="admin-list-card">
            <h4>Solicitações de Cotação Recebidas ({cotacoes.length})</h4>
            
            {cotacoes.length === 0 ? (
                <p>Nenhuma cotação nova encontrada.</p>
            ) : (
                <div className="cotacoes-list">
                    {cotacoes.map((c, index) => (
                        <div key={c.id} className="cotacao-item">
                            {/* Resumo no Card */}
                            <h5>{index + 1}. {c.nome} ({c.numPessoas} Vidas)</h5>
                            <p>📞: {c.telefone} | 📧: {c.email}</p>
                            <p>Enviado em: {c.data_envio ? new Date(c.data_envio).toLocaleDateString() : 'N/A'}</p>

                            <div style={{marginTop: '15px'}}>
                                {/* BOTÃO NOVO: VER DETALHES */}
                                <button 
                                    onClick={() => handleVerDetalhes(c)} 
                                    className="detalhes-btn"
                                >
                                    Ver Detalhes Completo
                                </button>

                                {/* BOTÃO EXCLUIR */}
                                <button
                                    onClick={() => handleDelete(c.id)}
                                    className="delete-btn"
                                    style={{backgroundColor: '#e74c3c', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <button onClick={fetchCotacoes} className="refresh-btn">Recarregar Lista</button>

            {/* --- O MODAL TIPO WHATSAPP --- */}
            {modalAberto && cotacaoSelecionada && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal-content-admin" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={fecharModal}>&times;</button>
                        
                        <h3 style={{color: '#0056b3', marginBottom: '20px'}}>Detalhes da Cotação</h3>
                        
                        {/*BOTEI A FORMATAÇÃO IGUAL ZAP */}
                        <div className="whatsapp-style-text">
                            <p><strong>🚨 NOVA SOLICITAÇÃO DE COTAÇÃO - CORRETOR ADRIANO SANTOS 🚨</strong></p>
                            <br/>
                            <p><strong>DADOS DO SOLICITANTE:</strong></p>
                            <p>Nome: {cotacaoSelecionada.nome}</p>
                            <p>Telefone: {cotacaoSelecionada.telefone}</p>
                            <p>Email: {cotacaoSelecionada.email}</p>
                            <p>Modalidade: {(cotacaoSelecionada.modalidade || 'N/A').toUpperCase()}</p>
                            <p>Local: {cotacaoSelecionada.bairro} - {cotacaoSelecionada.cidade}</p>
                            <p>---</p>
                            <br/>
                            <p><strong>DADOS DAS {cotacaoSelecionada.numPessoas} VIDAS:</strong></p>
                            {cotacaoSelecionada.vidas && cotacaoSelecionada.vidas.map((v, i) => (
                                <div key={i} style={{marginBottom: '10px'}}>
                                    <p>Pessoa #{i + 1}:</p>
                                    <p>&nbsp;&nbsp;- Idade: {v.idade}</p>
                                    <p>&nbsp;&nbsp;- Pré-existente: {v.pre_existente === 'sim' ? 
                                        <span><strong>SIM!</strong> ({v.doenca})</span> : 
                                        'Não'}
                                    </p>
                                </div>
                            ))}
                            <br/>
                            <p>---</p>
                            <p><i>_Cotação salva no sistema com sucesso._</i></p>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default VisualizarCotacoes;