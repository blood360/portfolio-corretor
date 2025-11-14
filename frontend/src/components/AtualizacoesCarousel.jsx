import React, { useState, useEffect } from 'react';
import CardAtualizacao from './CardAtualizacao';
import '../styles/AtualizacoesCarousel.css'; 

const AtualizacoesCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // NOVO ESTADO: Para controlar o fade-in/fade-out
  const [isFading, setIsFading] = useState(false); 

  useEffect(() => {
    if (items.length === 0) return;

    const interval = setInterval(() => {
        // 1. Inicia o fade-out (deixa o card invisível)
        setIsFading(true); 

        // 2. Após 500ms (tempo da transição CSS de saída), troca o índice
        const fadeOutTimer = setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
            // 3. Imediatamente após trocar o índice, inicia o fade-in (deixa o card visível)
            setIsFading(false); 
        }, 500); // Metade do tempo da transição no CSS

        // Limpa o timer de saída se o componente for desmontado antes
        return () => clearTimeout(fadeOutTimer);

    }, 3000); // O TEMPO TOTAL do intervalo continua sendo 3 segundos

    return () => clearInterval(interval);
  }, [items.length]); 
  
  // Função para mudar o card ao clicar no indicador (garantindo o fade)
  const handleIndicatorClick = (index) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsFading(false);
    }, 500);
  };

  if (items.length === 0) {
    return <p className="sem-atualizacoes">Ainda não há atualizações para mostrar.</p>;
  }

  const currentItem = items[currentIndex];

  return (
    <div className="carousel-container">
      {/* Aplica a classe 'fade-out' quando estiver em transição */}
      <div className={`carousel-item ${isFading ? 'fade-out' : 'fade-in'}`}>
        <CardAtualizacao data={currentItem} />
      </div>

      <div className="carousel-indicators">
        {items.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleIndicatorClick(index)}
            aria-label={`Ir para atualização ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AtualizacoesCarousel;