import React from 'react';
import '../styles/SantaAnimation.css'; 

const SantaAnimation = () => {
  return (
    <div className="santa-track">
      {/* CORREÇÃO: Usando a imagem local da pasta public/images */}
      <img 
        src="/images/santa_treno.gif" 
        alt="Papai Noel no Trenó" 
        className="santa-sleigh" 
        // Caso a imagem dê erro, esconde o elemento pra não ficar feio
        onError={(e) => e.target.style.display = 'none'}
      />
    </div>
  );
};

export default SantaAnimation;