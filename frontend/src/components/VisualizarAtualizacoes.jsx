import React, { useState, useEffect } from 'react';

// URL RELATIVA CORRETA
const API_URL_BASE = '/api/atualizacoes';

const VisualizarAtualizacoes = () => {
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({ titulo: '', descricao: '' }); // Imagem não edita aqui pra não pesar
    const [editStatus, setEditStatus] = useState('');

    const fetchUpdates = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL_BASE); 
            if (response.ok) {
                const data = await response.json();
                setUpdates(data);
            } else {
                setError(`Erro ao carregar updates. Status: ${response.status}`);
            }
        } catch (err) {
            setError('Erro de conexão com o backend. Verifique se o serviço Express está rodando.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (id) => {
        if (!window.confirm(`Tem certeza que deseja DELETAR a atualização ID ${id}?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_URL_BASE}/${id}`, { 
                method: 'DELETE',
            });
            if (response.ok) {
                alert(`Atualização ID ${id} removida!`);
                fetchUpdates(); 
            } else {
                alert('❌ Erro ao deletar atualização.');
            }
        } catch (error) {
            alert('Erro de rede ao deletar.');
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setEditStatus('Salvando...');

        try {
            // Nota: Não estamos enviando a imagem na edição simples para não complicar
            const response = await fetch(`${API_URL_BASE}/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });

            if (response.ok) {
                setEditStatus('✅ Editado com sucesso!');
                setEditId(null); 
                fetchUpdates(); 
            } else {
                const errorData = await response.json();
                setEditStatus(`❌ Erro: ${errorData.error || 'Falha ao editar'}`);
            }
        } catch (error) {
            setEditStatus('❌ Erro de conexão ao salvar.');
        }
    };

    useEffect(() => {
        fetchUpdates();
    }, []);

    if (loading) return <p>Carregando lista de atualizações...</p>;
    if (error) return <p className="error-message">❌ {error}</p>;

    return (
        <div className="admin-list-card">
            <h4>Atualizações Existentes ({updates.length})</h4>
            <p>Clique em Editar para modificar o Título ou Descrição.</p>

            {updates.length === 0 ? (
                <p>Nenhuma atualização cadastrada. Adicione uma na aba "Adicionar Atualização".</p>
            ) : (
                <div className="updates-list">
                    {updates.map(u => (
                        <div key={u.id} className="update-item">
                            
                            {editId === u.id ? (
                                // --- MODO EDIÇÃO ---
                                <form onSubmit={handleSaveEdit} className="edit-form">
                                    <label>Título:</label>
                                    <input type="text" value={editData.titulo} onChange={e => setEditData({...editData, titulo: e.target.value})} required />
                                    
                                    <label>Descrição:</label>
                                    <textarea value={editData.descricao} onChange={e => setEditData({...editData, descricao: e.target.value})} required />
                                    
                                    <div style={{marginTop: '10px'}}>
                                        <button type="submit" className="admin-submit-btn">Salvar</button>
                                        <button type="button" onClick={() => setEditId(null)} className="cancel-btn">Cancelar</button>
                                    </div>
                                    <p className="status-message-edit">{editStatus}</p>
                                </form>
                            ) : (
                                // --- MODO VISUALIZAÇÃO ---
                                <>
                                    <h5>{u.titulo}</h5>
                                    <p className="update-desc">{u.descricao.substring(0, 100)}...</p>
                                    
                                    {/* CORREÇÃO AQUI: Exibe a imagem pequena em vez do texto gigante */}
                                    <div className="update-meta" style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
                                        <span style={{fontSize: '0.85em', color: '#999'}}>Imagem:</span>
                                        {u.imagem ? (
                                            <img 
                                                src={u.imagem.startsWith('http') || u.imagem.startsWith('data:') ? u.imagem : `/images/${u.imagem}`} 
                                                alt="Preview" 
                                                style={{width: '50px', height: '30px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc'}}
                                            />
                                        ) : (
                                            <span style={{fontSize: '0.8em'}}>Sem imagem</span>
                                        )}
                                        <span style={{fontSize: '0.85em', color: '#999'}}> | Publicado: {new Date(u.data_publicacao).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <div className="action-buttons">
                                        <button 
                                            onClick={() => {
                                                setEditId(u.id);
                                                setEditData({ titulo: u.titulo, descricao: u.descricao });
                                            }} 
                                            className="edit-btn"
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(u.id)} 
                                            className="delete-btn"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <button onClick={fetchUpdates} className="refresh-btn">Recarregar Lista</button>
        </div>
    );
};

export default VisualizarAtualizacoes;