import React, { useState } from 'react';
import '../styles/Cotacao.css';

const Login = () => {
    const [senha, setSenha] = useState('');

    const handleLogin = (e) => {
        // Previne que a página recarregue sozinha antes da hora
        e.preventDefault();
        
        console.log("Tentando fazer login...");

        // SENHA DO SISTEMA
        const SENHA_SECRETA = "FUZn@v1994";

        if (senha === SENHA_SECRETA) {
            console.log("Bem vindo ao seu sistema, patrão!");
            // Salva o "crachá"
            localStorage.setItem('usuario_logado', 'true');
            
            window.location.href = '/admin';
        } else {
            alert("Sai daqui vacilão, nem sabe a senha do meu patrão e ta querendo entrar no sistema?");
            setSenha('');
        }
    };

    return (
        <div className="cotacao-container" style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}>
            <div className="cotacao-form" style={{maxWidth: '400px', width: '100%', padding: '40px'}}>
                <h2 style={{textAlign: 'center', color: '#0056b3'}}>🔒 Acesso Restrito</h2>
                <p style={{textAlign: 'center', marginBottom: '30px', color: '#666'}}>Área exclusiva do Corretor</p>
                
                <form onSubmit={handleLogin}>
                    <div className="material-input-group">
                        <input
                            id="senhaAdmin"
                            name="password"
                            type="password"
                            className="material-input-field"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Digite aqui..."
                            required
                            autoComplete="current-password"
                        />
                        <label htmlFor="senhaAdmin" className="material-input-label">Forneça sua Senha</label>
                    </div>
                    
                    <button type="submit" className="submit-cotacao-btn" style={{width: '100%'}}>
                        Entrar no Sistema
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;