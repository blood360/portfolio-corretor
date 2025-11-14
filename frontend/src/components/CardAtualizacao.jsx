import React from "react";
import '../styles/CardAtualizacao.css';

const CardAtualizacao = ({data}) => {
    return (
        <div className="card-atualizacao">
            <img src={`/images/${data.imagem}`} alt={data.titulo} className="card-imagem" />

            <div className="card-corpo">
                <h4>{data.titulo}</h4>
                <p>{data.descricao}</p>
                <button className="ler-mais-btn">Ver detalhes</button>
            </div>
        </div>
    );
};

export default CardAtualizacao;