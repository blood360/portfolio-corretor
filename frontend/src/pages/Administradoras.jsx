import React, { useState, useEffect } from 'react';
import '../styles/Administradoras.css';

const Administradoras = () => {
  // O estado para guardar a lista dinâmica
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
        // Usando a URL relativa para funcionar em produção
        const API_URL = '/api/administradoras'; 
        
        try {
            const response = await fetch(API_URL);
            
            if (response.ok) {
                const data = await response.json();
                setAdmins(data);
            } else {
                setError(`Falha ao carregar administradoras. Status: ${response.status}`);
            }
        } catch (err) {
            setError('Erro de rede. Verifique se o backend está rodando.');
            console.error('Erro de rede:', err);
        } finally {
            setLoading(false);
        }
    };
    fetchAdmins();
  }, []);


  if (loading) return <p>Carregando lista de administradoras...</p>;
  if (error) return <p className="error-message">❌ {error}</p>;

  return (
    <div className="administradoras-container">
      <h2>📊 Administradoras e Tabelas de Planos</h2>
      <p>
        Aqui você encontra as tabelas mais atualizadas com preços, redes credenciadas e hospitais.
        Como os valores mudam que nem o vento, **fale comigo no WhatsApp** para a cotação final, visse?
      </p>

      <div className="lista-administradoras">
        {admins.length === 0 ? (
            <p>Nenhuma administradora cadastrada. Por favor, adicione via o painel de administração (futuro recurso).</p>
        ) : (
            admins.map((admin) => (
            <div key={admin.id} className="admin-card">
                <img src={`/images/${admin.logo}`} alt={`Logo ${admin.nome}`} className="admin-logo" />
                <h3>{admin.nome}</h3>
                <p>{admin.descricao}</p>
                <button 
                  // O 'tabelas_url' é o link para a imagem ou PDF das tabelas (futura implementação do admin)
                  onClick={() => admin.tabelas_url ? window.open(admin.tabelas_url, '_blank') : alert('Tabelas ainda não foram cadastradas pelo corretor. Fale no WhatsApp!')}
                  className="ver-tabelas-btn"
                >
                  Ver Imagens das Tabelas
                </button>
            </div>
          ))
        )}
      </div>
      
      <p className="aviso-cotacao">
        **Atenção:** Os dados acima são informativos. **Solicite uma Cotação** para um preço exato e personalizado!
      </p>
    </div>
  );
};

export default Administradoras;