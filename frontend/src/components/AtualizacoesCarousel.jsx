import React, { useState, useEffect } from 'react';
import CardAtualizacao from './CardAtualizacao';
import '../styles/AtualizacoesCarousel.css'; 

const AtualizacoesCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  // Estado para saber se o mouse está em cima (pausa o carrossel)
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;
    if (isPaused) return; // SE ESTIVER PAUSADO, NÃO FAZ NADA!

    // AUMENTEI PARA 6000ms (6 Segundos)
    const interval = setInterval(() => {
        setIsFading(true);

        const fadeOutTimer = setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
            setIsFading(false);
        }, 500);

        return () => clearTimeout(fadeOutTimer);

    }, 6000);

    return () => clearInterval(interval);
  }, [items.length, isPaused]);
  
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
    <div 
        className="carousel-container"
        // PAUSA QUANDO O MOUSE ENTRA (OU TOCA NO CELULAR)
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)} // Para celular
    >
      <div className={`carousel-item ${isFading ? 'fade-out' : 'fade-in'}`}>
          <CardAtualizacao data={currentItem} isCarousel={true} />
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