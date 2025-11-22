import React, { useState } from 'react';
import Tab from '../components/Tab';
import AdicionarAtualizacao from '../components/AdicionarAtualizacao';
import VisualizarCotacoes from '../components/VisualizarCotacoes';
import VisualizarAtualizacoes from '../components/VisualizarAtualizacoes';
// IMPORTANDO O NOVO COMPONENTE DE ADMINISTRADORAS
import GerenciarAdministradoras from '../components/GerenciarAdministradoras';
import '../styles/Admin.css';

const Admin = () => {
  // Estado para controlar qual aba está ativa
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="admin-container">
      <h2>🔑 Painel Administrativo do Corretor</h2>
      <p>Área restrita para gerenciamento de conteúdo e acompanhamento das solicitações de cotação.</p>

      <div className="admin-tabs">
        <Tab 
          label="1. Adicionar Nova Atualização" 
          isActive={activeTab === 1} 
          onClick={() => setActiveTab(1)} 
        />
        <Tab 
          label="2. Gerenciar Atualizações" 
          isActive={activeTab === 2} 
          onClick={() => setActiveTab(2)} 
        />
        <Tab 
          label="3. Visualizar Cotações" 
          isActive={activeTab === 3} 
          onClick={() => setActiveTab(3)} 
        />
        {/* NOVA ABA AQUI 👇 */}
        <Tab 
          label="4. Gerenciar Administradoras" 
          isActive={activeTab === 4} 
          onClick={() => setActiveTab(4)} 
        />
      </div>
      
      <div className="admin-content">
        {activeTab === 1 && <AdicionarAtualizacao />}
        {activeTab === 2 && <VisualizarAtualizacoes />} 
        {activeTab === 3 && <VisualizarCotacoes />}
        {/* RENDERIZAÇÃO DO NOVO COMPONENTE 👇 */}
        {activeTab === 4 && <GerenciarAdministradoras />}
      </div>
    </div>
  );
};

export default Admin;