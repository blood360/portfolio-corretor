import React, { useState } from 'react';
import '../styles/Cotacao.css';

const Cotacao = () => {
    // Estado simplificado para capturar Lead Rápido
    const [form, setForm] = useState({ 
        nome: '', 
        telefone: '', 
        email: '', 
        tipo: 'PF', // PF ou PJ
        cnpj: '',   // Novo campo
        vidas: '',  // Começa vazio para não travar o input
        mensagem: '' 
    });
    
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Se vidas estiver vazio, assume 1, senão usa o número digitado
        const dadosParaEnviar = {
            ...form,
            vidas: form.vidas === '' ? 1 : Number(form.vidas)
        };

        setStatus('Enviando...');
        
        try {
            // Envia para o Backend
            const res = await fetch('/api/cotacoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosParaEnviar)
            });

            if (res.ok) {
                const result = await res.json();
                
                // --- INTEGRAÇÃO WHATSAPP ---
                const msgZap = `*NOVA SOLICITAÇÃO (ID: ${result.cotacaoId})*\n\n` +
                               `👤 *Nome:* ${form.nome}\n` +
                               `📞 *Tel:* ${form.telefone}\n` +
                               `🏥 *Tipo:* ${form.tipo} ${form.cnpj ? `(CNPJ: ${form.cnpj})` : ''}\n` +
                               `👥 *Vidas:* ${form.vidas}\n` +
                               `💬 *Msg:* ${form.mensagem || 'Sem mensagem'}`;
                
                const linkZap = `https://api.whatsapp.com/send?phone=5521980867488&text=${encodeURIComponent(msgZap)}`;
                
                // Abre o WhatsApp e Limpa o formulário
                window.open(linkZap, '_blank');
                setStatus('✅ Recebemos sua solicitação! Redirecionando para o WhatsApp...');
                setForm({ nome: '', telefone: '', email: '', tipo: 'PF', cnpj: '', vidas: '', mensagem: '' });
            } else {
                setStatus('❌ Erro ao enviar. Tente novamente.');
            }
        } catch (error) {
            setStatus('❌ Erro de conexão.');
        }
    };

    return (
        <div className="cotacao-wrapper">
            <div className="cotacao-card">
                <h2>Solicite sua Cotação</h2>
                <p>Preencha os dados abaixo para receber uma simulação personalizada.</p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Nome Completo *</label>
                        <input 
                            name="nome" 
                            value={form.nome} 
                            onChange={handleChange} 
                            required 
                            placeholder="Seu nome" 
                            className="material-input-field"
                        />
                    </div>

                    <div className="row-2">
                        <div className="input-group">
                            <label>Telefone / WhatsApp *</label>
                            <input 
                                name="telefone" 
                                value={form.telefone} 
                                onChange={handleChange} 
                                required 
                                placeholder="(21) 99999-9999" 
                                className="material-input-field"
                            />
                        </div>
                        <div className="input-group">
                            <label>E-mail (Opcional)</label>
                            <input 
                                name="email" 
                                value={form.email} 
                                onChange={handleChange} 
                                type="email" 
                                placeholder="seu@email.com" 
                                className="material-input-field"
                            />
                        </div>
                    </div>

                    <div className="row-2">
                        <div className="input-group">
                            <label>Tipo de Plano</label>
                            <select 
                                name="tipo" 
                                value={form.tipo} 
                                onChange={handleChange}
                                className="material-input-field"
                            >
                                <option value="PF">Pessoa Física (CPF)</option>
                                <option value="PJ">Empresarial (CNPJ)</option>
                            </select>
                        </div>
                        
                        {/* Correção do Input de Vidas: Tipo Number Simples */}
                        <div className="input-group">
                            <label>Quantidade de Vidas *</label>
                            <input 
                                type="number" 
                                name="vidas" 
                                value={form.vidas} 
                                onChange={handleChange} 
                                required 
                                min="1"
                                placeholder="Ex: 2"
                                inputMode="numeric" /* Melhora o teclado no celular */
                                className="material-input-field"
                            />
                        </div>
                    </div>

                    {/* Campo Condicional de CNPJ (Só aparece se for PJ) */}
                    {form.tipo === 'PJ' && (
                        <div className="input-group animate-fade-in" style={{marginTop: '15px'}}>
                            <label>CNPJ (Opcional)</label>
                            <input 
                                name="cnpj" 
                                value={form.cnpj} 
                                onChange={handleChange} 
                                placeholder="00.000.000/0000-00" 
                                className="material-input-field"
                            />
                        </div>
                    )}

                    <div className="input-group" style={{marginTop: '15px'}}>
                        <label>Mensagem ou Dúvidas (Idades, Preferências, etc)</label>
                        <textarea 
                            name="mensagem" 
                            value={form.mensagem} 
                            onChange={handleChange} 
                            placeholder="Ex: Tenho 30 anos e meu filho 5. Prefiro hospital na Barra..." 
                            rows="4"
                            className="material-input-field"
                        ></textarea>
                    </div>

                    <button type="submit" className="btn-enviar">Solicitar Simulação Grátis</button>
                </form>
                
                {status && <p className="status-msg" style={{textAlign: 'center', marginTop: '15px', fontWeight: 'bold'}}>{status}</p>}
            </div>
        </div>
    );
};

export default Cotacao;