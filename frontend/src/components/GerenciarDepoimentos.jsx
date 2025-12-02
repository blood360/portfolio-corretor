import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';
import '../styles/Cotacao.css';

const GerenciarDepoimentos = () => {
    const [depoimentos, setDepoimentos] = useState([]);
    const [form, setForm] = useState({ nome: '', local: '', texto: '', estrelas: 5 });
    const [status, setStatus] = useState('');

    const fetchDepoimentos = async () => {
        const res = await fetch('/api/depoimentos');
        if (res.ok) setDepoimentos(await res.json());
    };

    useEffect(() => { fetchDepoimentos(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Salvando...');
        await fetch('/api/depoimentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        setStatus('✅ Depoimento adicionado!');
        setForm({ nome: '', local: '', texto: '', estrelas: 5 });
        fetchDepoimentos();
    };

    const handleDelete = async (id) => {
        if(confirm('Apagar este depoimento?')) {
            await fetch(`/api/depoimentos/${id}`, { method: 'DELETE' });
            fetchDepoimentos();
        }
    }

    return (
        <div>
            <div className="admin-form-card" style={{padding: '30px', backgroundColor: '#fff', borderRadius: '15px'}}>
                <h4 style={{color: '#0056b3'}}>Adicionar Depoimento de Cliente</h4>
                
                <form onSubmit={handleSubmit} className="cotacao-form" style={{boxShadow: 'none', padding: 0}}>
                    
                    <div className="material-input-group">
                        <input className="material-input-field" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required placeholder="Ex: Maria da Silva" />
                        <label className="material-input-label">Nome do Cliente</label>
                    </div>

                    <div className="material-input-group">
                        <input className="material-input-field" value={form.local} onChange={e => setForm({...form, local: e.target.value})} required placeholder="Ex: Rio de Janeiro - RJ" />
                        <label className="material-input-label">Local / Cargo</label>
                    </div>

                    <div className="material-input-group">
                        <textarea className="material-input-field" value={form.texto} onChange={e => setForm({...form, texto: e.target.value})} required placeholder="O que o cliente falou..." />
                        <label className="material-input-label">Depoimento</label>
                    </div>

                    <div className="material-input-group">
                        <select className="material-input-field" value={form.estrelas} onChange={e => setForm({...form, estrelas: e.target.value})}>
                            <option value="5">⭐⭐⭐⭐⭐ (5 Estrelas)</option>
                            <option value="4">⭐⭐⭐⭐ (4 Estrelas)</option>
                            <option value="3">⭐⭐⭐ (3 Estrelas)</option>
                            <option value="2">⭐⭐ (2 Estrelas)</option>
                            <option value="1">⭐ (1 Estrela)</option>
                        </select>
                        <label className="material-input-label">Avaliação</label>
                    </div>

                    <button type="submit" className="submit-cotacao-btn">Salvar Depoimento</button>
                </form>
                <p className="status-message" style={{marginTop: '10px'}}>{status}</p>
            </div>

            <div className="admin-list-card" style={{marginTop: '20px'}}>
                <h4>Depoimentos Ativos</h4>
                {depoimentos.map(d => (
                    <div key={d.id} style={{border: '1px solid #eee', padding: '15px', margin: '10px 0', borderRadius: '10px', background: '#fff'}}>
                        <p><strong>{d.nome}</strong> ({d.local}) - {"⭐".repeat(d.estrelas)}</p>
                        <p style={{fontStyle: 'italic', color: '#666'}}>"{d.texto}"</p>
                        <button onClick={() => handleDelete(d.id)} className="delete-btn" style={{backgroundColor: '#e74c3c', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Excluir</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GerenciarDepoimentos;