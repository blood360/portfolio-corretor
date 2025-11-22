import React, { useState, useEffect } from 'react';

const GerenciarAdministradoras = () => {
    const [admins, setAdmins] = useState([]);
    const [form, setForm] = useState({ nome: '', descricao: '', logo: '', tabela: '' });
    const [status, setStatus] = useState('');

    const fetchAdmins = async () => {
        const res = await fetch('/api/administradoras');
        if (res.ok) setAdmins(await res.json());
    };

    useEffect(() => { fetchAdmins(); }, []);

    const convertToBase64 = (file, field) => {
        const reader = new FileReader();
        reader.onloadend = () => setForm(prev => ({ ...prev, [field]: reader.result }));
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Enviando...');
        await fetch('/api/administradoras', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        setStatus('✅ Salvo!');
        setForm({ nome: '', descricao: '', logo: '', tabela: '' });
        fetchAdmins();
    };

    const handleDelete = async (id) => {
        if(confirm('Deletar?')) {
            await fetch(`/api/administradoras/${id}`, { method: 'DELETE' });
            fetchAdmins();
        }
    }

    return (
        <div>
            <div className="admin-form-card">
                <h4>Adicionar Administradora</h4>
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <input placeholder="Nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
                    <input placeholder="Descrição" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} required />
                    
                    <label>Logo da Empresa:</label>
                    <input type="file" accept="image/*" onChange={e => convertToBase64(e.target.files[0], 'logo')} required />
                    
                    <label>Imagem da Tabela de Preços:</label>
                    <input type="file" accept="image/*" onChange={e => convertToBase64(e.target.files[0], 'tabela')} required />

                    <button type="submit" className="admin-submit-btn">Salvar Administradora</button>
                </form>
                <p>{status}</p>
            </div>

            <div className="admin-list-card" style={{marginTop: '20px'}}>
                <h4>Administradoras Cadastradas</h4>
                {admins.map(a => (
                    <div key={a.id} style={{border: '1px solid #ccc', padding: '10px', margin: '10px 0'}}>
                        <h5>{a.nome}</h5>
                        <img src={a.logo} alt="logo" style={{height: '50px'}} />
                        <button onClick={() => handleDelete(a.id)} className="delete-btn" style={{marginLeft: '10px'}}>Excluir</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GerenciarAdministradoras;