import React from "react";
import '../styles/MenuLateral.css';

const MenuLateral = ({isOpen, toggleMenu}) => {
    return (
        <nav className={`menu-lateral ${isOpen ? 'aberto' : 'fechado'}`}>
            <div className="menu-header">
                <h3>Corretor Adriano Santos</h3>
            </div>

            <ul className="menu-links">
                <li><a href="/">🏠 Home</a></li>
                <li><a href="/administradoras">📄 Administradoras/Tabelas</a></li>
                <li><a href="/cotacao">✍️ Solicitar Cotação</a></li>
                <li><a href="/contato">📞 Contato</a></li>
            </ul>

            <div className="mebnu-footer">
                <p><span>whatsapp: </span>(21)98086-7488</p>
            </div>
        </nav>
    );
};

export default MenuLateral;