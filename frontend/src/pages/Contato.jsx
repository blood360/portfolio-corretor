import React from "react";
import '../styles/Contato.css';

const Contato = () => {
    return (
        <div className="contato-container">
            <h2> 📞 Fale com o corretor</h2>
            <p>
                Seja pra tirar uma dúvida, agendar uma conversa ou mandar um alô, estou por aqui!
                Escolha o melhor jeito de falar comigo!
            </p>

            <div className="contato-info">
                <div className="contato-card">
                    <h3>📱 WhatsApp (O mais rápido!)</h3>
                    <p className="contato-detalhe">(21) 98086-7488</p>
                    <a href="https://wa.me/5521980867488" target="_blank" rel="noopener noreferrer" className="contato-btn whatsapp-btn">
                        Mandar Mensagem Agora
                    </a>
                </div>

                <div className="contato-card">
                    <h3>📧 E-mail:</h3>
                    <p className="contato-detalhe">adrianocarvalhonav@gmail.com</p>
                    <a href="mailto:adrianocarvalhonav@gmail.com" className="contato-btn email-btn">
                        Enviar Email
                    </a>
                </div>

                <div className="contato-card">
                    <h3>📍 Endereço</h3>
                    <p className="contato-detalhe">
                        Escritório (Atendimento com hora marcada)
                        Av. Dom Hélder Câmara 5555 Norte Office Del Castilho, Rio de Janeiro, Rio de Janeiro
                    </p>
                    <button className="contato-btn mapa-btn">Ver no Mapa</button>
                </div>
            </div>
        </div>
    );
};

export default Contato;