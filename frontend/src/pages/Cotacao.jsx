import React, { useState, useEffect } from 'react';
import '../styles/Cotacao.css';

// ===============================================
// FUNÇÃO AUXILIAR: Formata os dados para a URL do WhatsApp
// ===============================================
const formatarDadosParaWhatsApp = (data) => {
    let mensagem = `*🚨 NOVA SOLICITAÇÃO DE COTAÇÃO - CORRETOR ADRIANO SANTOS 🚨*\n\n`;
    
    mensagem += `*DADOS DO SOLICITANTE:*\n`;
    mensagem += `Nome: ${data.nome}\n`;
    mensagem += `Telefone: ${data.telefone}\n`;
    mensagem += `Email: ${data.email}\n`;
    mensagem += `Modalidade: ${(data.modalidade || 'N/A').toUpperCase()}\n`;
    mensagem += `Local: ${data.bairro} - ${data.cidade}\n`;
    mensagem += `---\n\n`;

    mensagem += `*DADOS DAS ${data.numPessoas} VIDAS:*\n`;
    
    data.idades.forEach((pessoa, index) => {
        mensagem += `Pessoa #${index + 1}:\n`;
        mensagem += `  - Idade: ${pessoa.idade || 'Não informada'}\n`;
        
        if (pessoa.preExistente === 'sim' && pessoa.doenca) {
            mensagem += `  - *PRÉ-EXISTENTE:* SIM! (${pessoa.doenca})\n`;
        } else {
            mensagem += `  - Pré-existente: Não\n`;
        }
    });

    mensagem += `\n---\n_Cotação salva no sistema com sucesso._`;

    return mensagem;
};


// Função para gerar um objeto de pessoa vazia
const criarNovaPessoa = (id) => ({
    id: id,
    idade: '',
    preExistente: 'não',
    doenca: '',
});

const Cotacao = () => {
  // Estado para guardar os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    modalidade: 'pf',
    bairro: '',
    cidade: '',
    numPessoas: 1,
    idades: [criarNovaPessoa(1)], // Começa com 1 pessoa
  });

  // Função genérica pra atualizar os campos simples
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função pra adicionar ou remover pessoas do plano (Vidas)
  const handlePessoasChange = (e) => {
    const novoNumPessoas = parseInt(e.target.value);
    
    // Garante que o número não seja menor que 1
    const pessoasValidas = Math.max(1, novoNumPessoas || 1); 

    const idadesAtuais = formData.idades;

    if (pessoasValidas > idadesAtuais.length) {
      // Adiciona novas pessoas até o número desejado
      const novasPessoas = Array.from({ length: pessoasValidas - idadesAtuais.length }, (_, i) => 
        criarNovaPessoa(idadesAtuais.length + i + 1)
      );
      setFormData({ 
        ...formData, 
        numPessoas: pessoasValidas, 
        idades: [...idadesAtuais, ...novasPessoas] 
      });
    } else if (pessoasValidas < idadesAtuais.length) {
      // Remove as últimas pessoas
      const novasIdades = idadesAtuais.slice(0, pessoasValidas);
      setFormData({ 
        ...formData, 
        numPessoas: pessoasValidas, 
        idades: novasIdades 
      });
    } else {
      setFormData({ ...formData, numPessoas: pessoasValidas });
    }
  };

  // Função para atualizar idade, pré-existência ou doença específica de cada pessoa
  const handlePessoaDetalheChange = (id, field, value) => {
    const novasIdades = formData.idades.map(pessoa => 
      pessoa.id === id ? { ...pessoa, [field]: value } : pessoa
    );
    setFormData({ ...formData, idades: novasIdades });
  };
  
  // ===============================================
  // FUNÇÃO PRINCIPAL: ENVIO E REDIRECIONAMENTO
  // ===============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    //URL do backend
    const API_URL = '/api/cotacoes';

    //objeto de dados enviao conforme o back
    const dadosParaEnviar = {
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      modalidade: formData.modalidade,
      cidade: formData.cidade,
      bairro: formData.bairro,
      numPessoas: formData.numPessoas,
      idades: formData.idades.map(({id, ...rest}) => rest),
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // CORREÇÃO DE TYPO AQUI
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (response.ok) {
        // A REQUISIÇÃO FOI BEM SUCEDIDA
        const result = await response.json();
        
        // 1. FORMATA A MENSAGEM
        const dadosFormatados = formatarDadosParaWhatsApp(formData);
        
        // 2. CONSTRUÇÃO DA URL DO WHATSAPP
        const SEU_NUMERO_WHATSAPP = '5521980867488'; 
        const mensagemCodificada = encodeURIComponent(dadosFormatados);
        const whatsappURL = `https://api.whatsapp.com/send?phone=${SEU_NUMERO_WHATSAPP}&text=${mensagemCodificada}`;

        // 3. ABRE O WHATSAPP EM NOVA ABA (Ação principal para notificação)
        window.open(whatsappURL, '_blank'); 

        alert(`Sua solicitação (ID: ${result.cotacaoId}) foi salva! Você será redirecionado para o WhatsApp para confirmar o envio ao Corretor!`);

        // DEPOIS DE ENVIADO LIMPA O FORMULÁRIO
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          modalidade: 'pf',
          bairro: '',
          cidade: '',
          numPessoas: 1,
          idades: [criarNovaPessoa(1)],
        });
      } else {
        // SE DER ERRO DO LADO DO SERVIDOR
        const errorData = await response.json();
        alert(`Erro ao enviar: ${errorData.error || 'Erro desconhecido'}. (Ocorreu um erro ao salvar o backup no sistema.)`);
      }
    } catch (error) {
      console.error('erro de rede ao enviar cotação:', error);
      alert('Verifique se o servidor está funcionando ou com problema de rede. reinicie o servidor.');
    }
  };

  return (
    <div className="cotacao-container">
      <h2>✍️ Solicitar Cotação Personalizada</h2>
      <p>
        Me passe as informações que eu calculo o melhor plano pra você! 
        Os dados de doença pré-existente são confidenciais e importantes pro preço.
      </p>

      <form onSubmit={handleSubmit} className="cotacao-form">
        
        {/* === Dados Pessoais do Solicitante === */}
        <fieldset className="form-section">
            <legend>Seus Dados</legend>
            <label>Nome Completo:</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
            
            <label>E-mail:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            
            <label>Telefone/WhatsApp:</label>
            <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(XX) XXXXX-XXXX" required />
        </fieldset>

        {/* === Modalidade e Localização (NOVOS CAMPOS) === */}
        <fieldset className="form-section">
            <legend>Detalhes da Cotação</legend>
            
            {/* Modalidade */}
            <label>Plano será na modalidade:</label>
            <select name="modalidade" value={formData.modalidade} onChange={handleChange} required>
                <option value="pf">Pessoa Física (PF)</option>
                <option value="cnpj">Pessoa Jurídica (CNPJ)</option>
            </select>
            
            {/* Localização */}
            <label>Onde você mora (Cidade e Bairro)?</label>
            <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Sua Cidade" required />
            <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} placeholder="Seu Bairro" required />

            {/* Número de Pessoas */}
            <label>Quantas pessoas entrarão no plano?</label>
            <input 
                type="number" 
                name="numPessoas" 
                min="1" 
                max="20"
                value={formData.numPessoas} 
                onChange={handlePessoasChange} 
                required 
            />
        </fieldset>

        {/* === Dados de Idade e Saúde por Pessoa === */}
        <fieldset className="form-section">
            <legend>Idade e Saúde dos {formData.numPessoas} Beneficiários</legend>
            
            {/* O loop agora garante que renderiza a quantidade exata em formData.idades */}
            {formData.idades.map((pessoa, index) => (
              <div key={pessoa.id} className="pessoa-detalhe">
                <h4>Pessoa #{index + 1}</h4>
                
                <label>Idade:</label>
                <input 
                    type="number" 
                    min="0"
                    max="99"
                    value={pessoa.idade} 
                    onChange={(e) => handlePessoaDetalheChange(pessoa.id, 'idade', e.target.value)}
                    required
                />

                <label>Tem doença ou lesão pré-existente?</label>
                <select 
                    value={pessoa.preExistente} 
                    onChange={(e) => handlePessoaDetalheChange(pessoa.id, 'preExistente', e.target.value)}
                >
                    <option value="não">Não</option>
                    <option value="sim">Sim</option>
                </select>

                {/* Aparece se o cabra marcar 'Sim' */}
                {pessoa.preExistente === 'sim' && (
                    <>
                        <label className="doenca-label">Qual a doença/lesão? (Especifique)</label>
                        <textarea 
                            value={pessoa.doenca} 
                            onChange={(e) => handlePessoaDetalheChange(pessoa.id, 'doenca', e.target.value)}
                            required={pessoa.preExistente === 'sim'}
                            placeholder="Ex: Diabetes tipo 2, hipertensão, cirurgia no joelho em 2020..."
                        />
                    </>
                )}
              </div>
            ))}
        </fieldset>
        
        <button type="submit" className="submit-cotacao-btn">
          Mandar Cotação pro Corretor!
        </button>
      </form>
    </div>
  );
};

export default Cotacao;