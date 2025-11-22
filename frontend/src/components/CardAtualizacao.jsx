import React from "react";
import '../styles/CardAtualizacao.css';

const CardAtualizacao = ({data}) => {
    // O src da imagem agora aceita o Base64 direto do banco
    const imagemSrc = data.imagem || 'https://via.placeholder.com/300x200?text=Sem+Imagem';

    const handleClick = () => {
        alert(`Detalhes:\n\n${data.titulo}\n\n${data.descricao}`);
    };
    
    return (
        <div className="card-atualizacao">
            <img src={imagemSrc} alt={data.titulo} className="card-imagem" />
            <div className="card-corpo">
                <h4>{data.titulo}</h4>
                <p>{data.descricao.substring(0, 80)}...</p> 
                <button onClick={handleClick} className="ler-mais-btn">Ver detalhes</button>
            </div>
        </div>
    );
};

export default CardAtualizacao;