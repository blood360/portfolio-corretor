import React from 'react';
import { Link } from 'react-router-dom'; 
import '../styles/MenuLateral.css'; 

const MenuLateral = ({ isOpen, toggleMenu }) => {
  return (
    <nav className={`menu-lateral ${isOpen ? 'aberto' : 'fechado'}`}>
      <div className="menu-header">
        
        <img 
            src="/images/logo_adriano.png" 
            alt="Logo AS" 
            className="menu-logo-img" 
        />
        
        <button onClick={toggleMenu} className="fechar-btn">
          X
        </button>
      </div>

      <ul className="menu-links">
        <li><a href="/">🏠 Home</a></li>
        <li><a href="/administradoras">📄 Administradoras</a></li>
        <li><a href="/cotacao">✍️ Solicitar Cotação</a></li>
        <li><a href="/contato">📞 Contato</a></li>
        
        <li style={{marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px'}}>
            <a href="/login" style={{color: '#ffc107'}}>
                🔐 Área do Corretor
            </a>
        </li>
      </ul>
      
      <div className="menu-footer">
          <p>Zap: (21) 98086-7488</p>
      </div>
    </nav>
  );
};

export default MenuLateral;