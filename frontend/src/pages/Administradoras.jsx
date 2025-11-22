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

  // Função auxiliar para decidir como mostrar a LOGO
  const getLogoSrc = (logo) => {
      if (!logo) return 'https://via.placeholder.com/150?text=Sem+Logo';
      
      // Se for Base64 (começa com data:) ou Link externo (http), usa direto
      if (logo.startsWith('data:') || logo.startsWith('http')) {
          return logo;
      }
      // Se não, tenta buscar na pasta local
      return `/images/${logo}`;
  };

  // Função para abrir a TABELA
  const handleVerTabela = (admin) => {
      // O backend novo salva em 'tabela', o antigo mock salvava em 'tabelas_url'. Testamos os dois.
      const tabelaSrc = admin.tabela || admin.tabelas_url;

      if (tabelaSrc) {
          const win = window.open();
          // Escreve um HTML simples na nova aba para exibir a imagem
          win.document.write(
              '<style>body{margin:0; display:flex; justify-content:center; background:#333;}</style>' +
              '<img src="' + tabelaSrc + '" style="max-width:100%; height:auto;" />'
          );
      } else {
          alert('Tabelas ainda não foram cadastradas para esta administradora. Fale no WhatsApp!');
      }
  };

  if (loading) return <p>Carregando lista de administradoras...</p>;
  if (error) return <p className="error-message">❌ {error}</p>;

  return (
    <div className="administradoras-container">
      <h2>📊 Administradoras e Tabelas de Planos</h2>
      <p>
        Aqui você encontra as tabelas mais atualizadas com preços, redes credenciadas e hospitais.
        Como os valores mudam frequentemente, **fale comigo no WhatsApp** para a cotação final.
      </p>

      <div className="lista-administradoras">
        {admins.length === 0 ? (
            <p>Nenhuma administradora cadastrada. Por favor, adicione via o painel de administração.</p>
        ) : (
            admins.map((admin) => (
            <div key={admin.id} className="admin-card">
                {/* Usa a função getLogoSrc para resolver a imagem */}
                <img 
                    src={getLogoSrc(admin.logo)} 
                    alt={`Logo ${admin.nome}`} 
                    className="admin-logo" 
                />
                
                <h3>{admin.nome}</h3>
                <p>{admin.descricao}</p>
                
                <button 
                  onClick={() => handleVerTabela(admin)}
                  className="ver-tabelas-btn"
                >
                  Ver Imagens das Tabelas
                </button>
            </div>
          ))
        )}
      </div>
      
      <p className="aviso-cotacao">
        <strong>Atenção:</strong> Os dados acima são informativos. <strong>Solicite uma Cotação</strong> para um preço exato e personalizado!
      </p>
    </div>
  );
};

export default Administradoras;