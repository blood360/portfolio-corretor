import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  // -----------------------------------------

  return (
    <div className="home-wrapper">
      
      {/* 1. HERO SECTION (TOPO DEGRADÊ) */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Corretora Marins Benefícios</span>
          <h1>Sua Saúde em <br/>Primeiro Lugar</h1>
          <p>
            Olá! Eu sou o <strong>Corretor Adriano Santos</strong>. 
            Com mais de 2 anos de experiência, meu trabalho é garantir a melhor escolha de um plano para você, sua família ou empresa.
            Clareza, honestidade e o preço que cabe no seu bolso.
          </p>
          <div className="hero-buttons">
            <Link to="/cotacao" className="btn-hero primary">Fazer Cotação</Link>
            <Link to="/contato" className="btn-hero secondary">Fale Comigo</Link>
          </div>
        </div>
        
        {/* IMAGEM DO TOPO (Se tiver uma foto sua, coloque o nome dela aqui em public/images/) */}
        <div className="hero-image">
            <img src="/images/perfil.png" alt="Corretor Adriano Santos" />
        </div>
      </section>

      {/* 2. FAIXA DE DESTAQUES (CARDS FLUTUANTES) */}
      <section className="features-strip">
        <div className="feature-card">
            <h3>Planos Individuais</h3>
            <p>Proteção completa para você e sua família.</p>
        </div>
        <div className="feature-card">
            <h3>Planos Empresariais</h3>
            <p>O melhor custo-benefício para sua equipe.</p>
        </div>
        <div className="feature-card">
            <h3>Rede Credenciada</h3>
            <p>Hospitais e laboratórios de excelência.</p>
        </div>
      </section>

      {/* 3. ATUALIZAÇÕES (CARROSSEL DO BACKEND) */}
      <section className="updates-section">
        <div className="section-header">
          <h2>Novidades & Oportunidades</h2>
          <p>Fique por dentro das últimas notícias do mercado de saúde.</p>
        </div>
        
        <div className="carousel-wrapper">
             {loading ? (
                <p>Carregando as últimas notícias...</p>
             ) : (
                /* Aqui usamos os dados reais do estado 'atualizacoes' */
                <AtualizacoesCarousel items={atualizacoes} />
             )}
        </div>
      </section>

      {/* 4. SOBRE (NOSSA MISSÃO) */}
      <section className="about-section">
        <div className="about-image">
             {/* Você pode trocar essa imagem por outra em public/images */}
             <img src="/images/logomarins.png" alt="Marins Benefícios" />
        </div>
        <div className="about-content">
             <h4>Quem Somos</h4>
             <h2>Nossa Missão</h2>
             <p>
                Prover tranquilidade e segurança, com planos que são garantia de paz.
                Conte comigo pra fazer o melhor negócio! 
                Na <strong>Marins Benefícios</strong>, nosso foco é descomplicar o acesso à saúde.
             </p>
             <Link to="/contato" className="btn-link">Entre em Contato &rarr;</Link>
        </div>
      </section>

    </div>
  );
};

export default Home;