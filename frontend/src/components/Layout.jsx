import React, { useState } from 'react';
import MenuLateral from './MenuLateral';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Administradoras from '../pages/Administradoras';
import Cotacao from '../pages/Cotacao';
import Contato from '../pages/Contato';
import Footer from './Footer';
import Admin from '../pages/Admin';
import Login from '../pages/Login';
import RotaProtegida from './RotaProtegida';
import Novidades from '../pages/Novidades';
import BotaoWhatsApp from './BotaoWhatsApp';
import "../App.css";

const Layout = () => {
    const [menuAberto, setMenuAberto] = useState(false);
    
    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
    };

    const contentClass = `conteudo ${menuAberto ? 'menu-aberto' : 'menu-fechado'}`;

    return (
        <Router>
            <div className="layout-container">
                {!menuAberto && (
                    <button onClick={toggleMenu} className='toggle-button-fixed'>
                        ☰
                    </button>
                )}

                <MenuLateral isOpen={menuAberto} toggleMenu={toggleMenu} />

                <main className={contentClass}>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path="/novidades" element={<Novidades />} />
                        <Route path="/administradoras" element={<Administradoras />} />
                        <Route path="/cotacao" element={<Cotacao />} />
                        <Route path="/contato" element={<Contato />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin" element={
                            <RotaProtegida>
                                <Admin />
                            </RotaProtegida>
                        } />
                    </Routes>
                </main>

                <BotaoWhatsApp />
                <Footer />
            </div>
        </Router>
    );
};

export default Layout;