import React from 'react';
import { FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa';
import '../styles/Footer.css'; 

const Footer = () => {
    const linksSociais = {
        whatsapp: "https://wa.me/5521980867488",
        instagram: "https://www.instagram.com/adriano_santosn/",
        facebook: "https://facebook.com/corretorseverino",
    };
    
    // Ano atual para deixar o copyright sempre atualizado
    const anoAtual = new Date().getFullYear();

    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-brand">
                    <h4>Corretor Adriano Santos - Saúde & Proteção</h4>
                    <p>&copy; {anoAtual} Todos os direitos reservados. Feito no Rio de Janeiro.</p>
                </div>

                <div className="footer-links">
                    <h5>Navegação</h5>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/administradoras">Administradoras</a></li>
                        <li><a href="/cotacao">Solicitar Cotação</a></li>
                        <li><a href="/contato">Contato</a></li>
                    </ul>
                </div>
                
                <div className="footer-social">
                    <h5>Siga nas Redes</h5>
                    <div className="social-icons">
                        {/* WhatsApp */}
                        <a href={linksSociais.whatsapp} target="_blank" rel="noopener noreferrer" className="social-icon whatsapp">
                            <FaWhatsapp />
                        </a>
                        
                        {/* Instagram */}
                        <a href={linksSociais.instagram} target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                            <FaInstagram />
                        </a>
                        
                        {/* Facebook */}
                        <a href={linksSociais.facebook} target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                            <FaFacebookF />
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-disclaimer">
                <p>Aviso: As informações de planos são apenas para referência. Cotações e valores finais devem ser confirmados diretamente com o corretor.</p>
            </div>
        </footer>
    );
};

export default Footer;