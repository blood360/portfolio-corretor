import React from 'react';
import '../styles/Snowfall.css';

const Snowfall = () => {
    // Cria um array de 50 flocos
    const flakes = Array.from({ length: 50 });

    return (
        <div className="snow-container">
            {flakes.map((_, i) => (
                <div key={i} className="snowflake">❅</div>
            ))}
        </div>
    );
};

export default Snowfall;