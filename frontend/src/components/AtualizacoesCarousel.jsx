import React, { useState, useEffect } from 'react';
import CardAtualizacao from './CardAtualizacao';
import '../styles/AtualizacoesCarousel.css';

const AtualizacoesCarousel = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3); // Padrão: 3 cards
    const [isPaused, setIsPaused] = useState(false);

    // Ajusta a quantidade de cards baseado no tamanho da tela
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsPerPage(1); // Celular: 1 card
            } else if (window.innerWidth < 1024) {
                setItemsPerPage(2); // Tablet: 2 cards
            } else {
                setItemsPerPage(3); // PC: 3 cards
            }
        };

        handleResize(); // Executa ao abrir
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Lógica de Rotação Automática
    useEffect(() => {
        if (items.length <= itemsPerPage) return; // Se tem poucos itens, não gira
        if (isPaused) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // 5 segundos

        return () => clearInterval(interval);
    }, [currentIndex, items.length, itemsPerPage, isPaused]);

    // Função para ir para o próximo grupo
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => {
            // Se chegou no final, volta pro começo
            if (prevIndex + 1 > items.length - itemsPerPage) {
                return 0;
            }
            return prevIndex + 1;
        });
    };

    // Função para calcular quais itens mostrar agora
    // Ex: Se currentIndex é 0 e itemsPerPage é 3, mostra itens [0, 1, 2]
    const visibleItems = items.slice(currentIndex, currentIndex + itemsPerPage);
    
    // Se o slice for menor que itemsPerPage (fim da lista), completamos com o início (loop infinito visual)
    // Mas para simplificar a lógica inicial, vamos apenas impedir o avanço além do limite na função nextSlide

    if (items.length === 0) {
        return <p className="sem-atualizacoes">Nenhuma novidade no momento.</p>;
    }

    return (
        <div 
            className="carousel-container"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
        >
            <div className="carousel-track">
                {/* Renderiza os itens visíveis */}
                {visibleItems.map((item) => (
                    <div key={item.id} className="carousel-slot" style={{ width: `${100 / itemsPerPage}%` }}>
                        <CardAtualizacao data={item} isCarousel={true} />
                    </div>
                ))}
            </div>

            {/* Indicadores (Bolinhas) */}
            {items.length > itemsPerPage && (
                <div className="carousel-indicators">
                    {Array.from({ length: items.length - itemsPerPage + 1 }).map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Ir para grupo ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AtualizacoesCarousel;