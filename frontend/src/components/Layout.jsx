import React, { useState } from 'react';
import MenuLateral from './MenuLateral';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Administradoras from '../pages/Administradoras';
import Cotacao from '../pages/Cotacao';
import Contato from '../pages/Contato';
import Footer from './Footer';
import Admin from '../pages/Admin';

const Layout = () => {
    const [menuAberto, setMenuAberto] = useState(false);
    //FUNCAO PARA MUDAR O ESTADO (ABRE E FECHA O MENU)
    const toggleMenu = () => {
        setMenuAberto(!menuAberto)
    };

    // Determina a classe dinâmica para o conteúdo principal
    const contentClass = `conteudo ${menuAberto ? 'menu-aberto' : 'menu-fechado'}`;

    return (
        <Router>
            <button onClick={toggleMenu} className='toggle-button-fixed'>
                {menuAberto ? 'X': '☰'}
            </button>

            <MenuLateral isOpen={menuAberto} toggleMenu={toggleMenu} />

            <main className={contentClass}>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path="/administradoras" element={<Administradoras />} />
                    <Route path="/cotacao" element={<Cotacao />} />
                    <Route path="/contato" element={<Contato />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </main>

            <Footer />
        </Router>
    );
};

export default Layout;