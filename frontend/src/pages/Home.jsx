import React, { useState, useEffect } from 'react';
import AtualizacoesCarousel from '../components/AtualizacoesCarousel'; 
import '../styles/Home.css';

const Home = () => {
  const [atualizacoes, setAtualizacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAtualizacoes = async () => {
    const API_ENDPOINT = '/api/atualizacoes'; 

      try {
        const response = await fetch(API_ENDPOINT);
        
        if (response.ok) {
          const data = await response.json();
          setAtualizacoes(data);
        } else {
          console.error('Erro ao buscar atualizações:', response.status);
        }
      } catch (error) {
        console.error('Erro de rede ao buscar atualizações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAtualizacoes();
  }, []);

  return (
    <div className="home-container">
      <h2>👋 Sejam Bem-Vindos à Corretora Marins Beneficios!</h2>
      <p>
        Olá Eu sou o Corretor Adriano Santos,
        e meu trabalho é garantir a melhor escolha de um plano para você, sua família ou Empresa.
        Com mais de 2 anos de experiência, trago o melhor plano e com aquele preço que
        cabe no seu bolso e que atende suas necessidades.
        Meu meu trabalho é clareza e honestidade.
      </p>

      <h3>🔥 Últimas Notícias e Atualizações</h3>
      
      {loading ? (
        <p>Carregando as últimas notícias...</p>
      ) : (
        <AtualizacoesCarousel items={atualizacoes} />
      )}

      <h3>Nossa Missão</h3>
      <p>
        Prover tranquilidade e segurança, com planos que são garantia de paz.
        Conte comigo pra fazer o melhor negócio!
      </p>
    </div>
  );
};

export default Home;