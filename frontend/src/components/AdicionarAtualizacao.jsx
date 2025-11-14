import React, { useState } from 'react';

const AdicionarAtualizacao = () => {
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        imagem: '',
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Enviando...');
        
        const API_URL = '/api/atualizacoes'; 

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                setStatus(`✅ Atualização salva! ID: ${result.id}. Recarregue a Home para ver!`);
                setFormData({ titulo: '', descricao: '', imagem: '' }); // Limpa o formulário
            } else {
                const errorData = await response.json();
                setStatus(`❌ Erro ao salvar: ${errorData.error || 'Erro no servidor.'}`);
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            setStatus('❌ Erro de conexão com o backend (porta 3001).');
        }
    };

    return (
        <div className="admin-form-card">
            <h4>Adicionar Novo Card de Notícia</h4>
            <form onSubmit={handleSubmit} className="form-atualizacao">
                
                <label>Título:</label>
                <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
                
                <label>Descrição:</label>
                <textarea name="descricao" value={formData.descricao} onChange={handleChange} required />
                
                <label>Nome da Imagem (Ex: checkup.jpg):</label>
                <input type="text" name="imagem" value={formData.imagem} onChange={handleChange} placeholder="O arquivo deve estar em public/images/" required />
                
                <button type="submit" className="admin-submit-btn">Salvar Atualização</button>
            </form>
            <p className="status-message">{status}</p>
        </div>
    );
};

export default AdicionarAtualizacao;