import React from "react";
import '../styles/CardAtualizacao.css';

const CardAtualizacao = ({data}) => {
    const handleClick = () => {
        alert(`Detalhes da Notícia:\n\nTítulo: ${data.titulo}\n\nDescrição Completa: ${data.descrcicao}`);
    };

    return (
        <div className="card-atualizacao">
            <div className="card-corpo">
                <img
                src={`/images/${data.imagem}`}
                alt={data.titulo}
                className="card-imagem"
                />
                <button onClick={handleClick} className="ler-mais-btn">
                    Ver Detalhes
                </button>
            </div>
        </div>
    );
};

export default CardAtualizacao;