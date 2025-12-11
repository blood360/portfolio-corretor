import React from "react";
import '../styles/BotaoWhatsApp.css';

const BotaoWhatsApp = () => {
    const numero = "21980867488";
    const mensagem = 'Olá Corretor Adriano! Gostaria de uma cotação de plano de saúde.'

    const linkZap = `https://wa.me/${5521980867488}?text=${encodeURIComponent(mensagem)}`;

    return (
        <a
            href={linkZap}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp-flutuante"
            aria-label="Falar no WhatsApp"
        >
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                alt="WhatsApp"
            />
            <span className="tooltip-zap">Fale Comigo</span>
        </a>
    );
};

export default BotaoWhatsApp;