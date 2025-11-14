import React, { useState, useEffect } from 'react';

const API_URL_BASE = 'http://localhost:3001/api/cotacoes'; 

const VisualizarCotacoes = () => {
    const [cotacoes, setCotacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função de fetch para carregar os dados
    const fetchCotacoes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL_BASE); 
            
            if (response.ok) {
                const data = await response.json();
                setCotacoes(data);
            } else {
                const errorText = await response.text();
                console.error("Erro do Servidor:", response.status, errorText);
                setError(`Erro ao carregar dados do servidor. Status: ${response.status}`);
            }
        } catch (err) {
            setError('Erro de conexão com o backend. Verifique a porta 3001.');
            console.error("Erro de Rede ou Parse:", err);
        } finally {
            setLoading(false);
        }
    };

    // NOVO: Função para deletar uma cotação específica
    const handleDelete = async (cotacaoId) => {
        // Confirmação antes de deletar
        if (!window.confirm(`Tem certeza que deseja DELETAR a cotação ID ${cotacaoId}? Esta ação é irreversível!`)) {
            return;
        }

        const API_DELETE_URL = `${API_URL_BASE}/${cotacaoId}`;

        try {
            const response = await fetch(API_DELETE_URL, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert(`Cotação ID ${cotacaoId} deletada com sucesso!`);
                // Depois de deletar, recarrega a lista para atualizar a tela
                fetchCotacoes(); 
            } else {
                const errorData = await response.json();
                alert(`❌ Erro ao deletar: ${errorData.error || 'Erro desconhecido.'}`);
            }
        } catch (error) {
            console.error('Erro de rede ao deletar:', error);
            alert('Erro de conexão ao tentar deletar a cotação.');
        }
    };
    
    // Carrega os dados na primeira vez
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
                            <h5>{index + 1}. {c.nome} ({c.numPessoas} Vidas)</h5>
                            <p>📞: {c.telefone} | 📧: {c.email}</p>
                            
                            <p>📍: {c.bairro}, {c.cidade} | Modalidade: **{(c.modalidade || 'N/A').toUpperCase()}**</p>
                            
                            <p>Enviado em: {c.data_envio ? new Date(c.data_envio).toLocaleDateString() : 'N/A'} ({c.data_envio ? c.data_envio.substring(11, 16) : 'N/A'})</p>

                            {c.vidas && c.vidas.length > 0 && (
                                <div className="vidas-detalhe">
                                    <h6>Detalhe das Vidas:</h6>
                                    <ul>
                                        {c.vidas.map((v, i) => (
                                            <li key={i}>
                                                Idade: {v.idade} | Pré-existente: **{(v.pre_existente || 'NÃO').toUpperCase()}** {v.doenca && ` (${v.doenca})`}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* BOTÃO ATUALIZADO para chamar handleDelete */}
                            <button 
                                onClick={() => handleDelete(c.id)} 
                                className="atender-btn"
                            >
                                Excluir Cotação
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <button onClick={fetchCotacoes} className="refresh-btn">Recarregar Lista</button>
        </div>
    );
};

export default VisualizarCotacoes;