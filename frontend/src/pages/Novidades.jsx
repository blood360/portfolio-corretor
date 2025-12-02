import React, { useState, useEffect } from 'react';
import CardAtualizacao from '../components/CardAtualizacao';
import '../styles/Novidades.css';

const Novidades = () => {
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNoticias = async () => {
            const API_URL = '/api/atualizacoes';
            try {
                const response = await fetch(API_URL);
                if (response.ok) {
                    const data = await response.json();
                    setNoticias(data);
                } else {
                    console.error("Erro ao buscar novidades");
                }
            } catch (error) {
                console.error("Erro de rede:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNoticias();
    }, []);

    return (
        <div className="novidades-container">
            <div className="novidades-header">
                <h2>🗞️ Novidades e Oportunidades</h2>
                <p>
                    Confira as últimas atualizações sobre tabelas de preços, 
                    novos hospitais credenciados e oportunidades exclusivas.
                </p>
            </div>

            {loading ? (
                <p style={{textAlign: 'center'}}>Carregando novidades...</p>
            ) : noticias.length === 0 ? (
                <p style={{textAlign: 'center'}}>Nenhuma novidade cadastrada no momento.</p>
            ) : (
                <div className="novidades-grid">
                    {noticias.map(item => (
                        <CardAtualizacao key={item.id} data={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Novidades;