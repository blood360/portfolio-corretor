import React, { useState } from "react";
import '../styles/CardAtualizacao.css';

const CardAtualizacao = ({data}) => {
    // Estado para controlar se o Modal está aberto ou fechado
    const [modalAberto, setModalAberto] = useState(false);
    
    // FUNÇÃO INTELIGENTE PARA DECIDIR A ORIGEM DA IMAGEM
    const getImagemSrc = (imagem) => {
        if (!imagem) return 'https://via.placeholder.com/300x200?text=Sem+Imagem';
        if (imagem.startsWith('http') || imagem.startsWith('data:')) {
            return imagem;
        }
        return `/images/${imagem}`;
    };

    // Função para abrir o modal
    const abrirModal = () => {
        setModalAberto(true);
    };

    // Função para fechar o modal
    const fecharModal = (e) => {
        // Garante que só fecha se clicar no fundo escuro ou no botão X
        e.stopPropagation();
        setModalAberto(false);
    };

    const imagemFinal = getImagemSrc(data.imagem);

    return (
        <>
            {/* --- O CARD (O que aparece no carrossel) --- */}
            <div className="card-atualizacao">
                <img 
                    src={imagemFinal} 
                    alt={data.titulo} 
                    className="card-imagem" 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Imagem+Indisponivel'; }}
                />

                <div className="card-corpo">
                    <h4>{data.titulo}</h4>
                    <p>{data.descricao.substring(0, 80)}...</p> 
                    <button onClick={abrirModal} className="ler-mais-btn">
                        Ver Detalhes
                    </button>
                </div>
            </div>

            {/* --- O MODAL (A janela que abre) --- */}
            {modalAberto && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={fecharModal}>&times;</button>
                        
                        <img src={imagemFinal} alt={data.titulo} className="modal-imagem-grande" />
                        
                        <div className="modal-texto">
                            <h3>{data.titulo}</h3>
                            <p>{data.descricao}</p>
                            <small>Publicado em: {new Date(data.data_publicacao).toLocaleDateString()}</small>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CardAtualizacao;