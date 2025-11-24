import React, { useState } from 'react';

const AdicionarAtualizacao = () => {
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        imagem: '', //guarda o código Base64 da imagem
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // NOVA FUNÇÃO: Converte o arquivo do computador para Base64 (Texto)
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Pega o primeiro arquivo selecionado
        
        if (file) {
            // Verifica o tamanho (opcional, ex: limite de 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("A imagem é muito grande! Escolha uma menor que 5MB.");
                return;
            }

            const reader = new FileReader();
            
            // Quando terminar de ler o arquivo, salva no estado
            reader.onloadend = () => {
                setFormData({ ...formData, imagem: reader.result });
            };
            
            // Começa a ler o arquivo como URL de dados
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Enviando (aguarde, pode demorar um pouquinho por causa da imagem)...');
        
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
                setStatus(`✅ Atualização salva! Recarregue a Home para ver!`);
                
                // Limpa o formulário
                setFormData({ titulo: '', descricao: '', imagem: '' }); 
                
                // Limpa o campo de arquivo visualmente
                const fileInput = document.getElementById('fileInput');
                if(fileInput) fileInput.value = '';
                
            } else {
                const errorData = await response.json();
                setStatus(`❌ Erro ao salvar: ${errorData.error || 'Erro no servidor.'}`);
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            setStatus('❌ Erro de conexão com o backend.');
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
                
                <label>Escolha a Imagem (Upload do PC/Celular):</label>
                <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                />
                
                {formData.imagem && (
                    <div style={{marginTop: '15px', marginBottom: '15px', textAlign: 'center'}}>
                        <p style={{fontSize: '0.9em', color: '#666'}}>Pré-visualização:</p>
                        <img
                            src={formData.imagem}
                            alt="Preview"
                            style={{maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #ddd'}}
                        />
                    </div>
                )}
                
                <button type="submit" className="admin-submit-btn">Salvar Atualização</button>
            </form>
            <p className="status-message">{status}</p>
        </div>
    );
};

export default AdicionarAtualizacao;