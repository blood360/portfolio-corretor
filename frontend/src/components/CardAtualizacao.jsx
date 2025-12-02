import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../styles/CardAtualizacao.css';

const CardAtualizacao = ({ data, isCarousel = false }) => {
    const [modalAberto, setModalAberto] = useState(false);
    
    const getImagemSrc = (imagem) => {
        if (!imagem) return 'https://via.placeholder.com/300x200?text=Sem+Imagem';
        if (imagem.startsWith('http') || imagem.startsWith('data:')) {
            return imagem;
        }
        return `/images/${imagem}`;
    };

    const abrirModal = () => setModalAberto(true);
    
    const fecharModal = (e) => {
        e.stopPropagation();
        setModalAberto(false);
    };

    const imagemFinal = getImagemSrc(data.imagem);

    return (
        <>
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
                    {isCarousel ? (
                        <Link to="/novidades" className="ler-mais-btn" style={{display: 'inline-block', textAlign: 'center', textDecoration: 'none'}}>
                            Ver na Página de Novidades
                        </Link>
                    ) : (
                        <button onClick={abrirModal} className="ler-mais-btn">
                            Ver Detalhes Completos
                        </button>
                    )}
                </div>
            </div>

            {/* O Modal só existe se NÃO for carrossel e estiver aberto */}
            {!isCarousel && modalAberto && (
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