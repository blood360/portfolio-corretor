import React, { useState } from 'react';
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
    idades: [criarNovaPessoa(1)], 
  });

  // Função genérica pra atualizar os campos simples
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função pra adicionar ou remover pessoas do plano (Vidas)
  const handlePessoasChange = (e) => {
    const novoNumPessoas = parseInt(e.target.value);
    const pessoasValidas = Math.max(1, novoNumPessoas || 1); 
    const idadesAtuais = formData.idades;

    if (pessoasValidas > idadesAtuais.length) {
      const novasPessoas = Array.from({ length: pessoasValidas - idadesAtuais.length }, (_, i) => 
        criarNovaPessoa(idadesAtuais.length + i + 1)
      );
      setFormData({ 
        ...formData, 
        numPessoas: pessoasValidas, 
        idades: [...idadesAtuais, ...novasPessoas] 
      });
    } else if (pessoasValidas < idadesAtuais.length) {
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

  const handlePessoaDetalheChange = (id, field, value) => {
    const novasIdades = formData.idades.map(pessoa => 
      pessoa.id === id ? { ...pessoa, [field]: value } : pessoa
    );
    setFormData({ ...formData, idades: novasIdades });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = '/api/cotacoes';

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
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (response.ok) {
        const result = await response.json();
        
        const dadosFormatados = formatarDadosParaWhatsApp(formData);
        const SEU_NUMERO_WHATSAPP = '5521980867488'; 
        const mensagemCodificada = encodeURIComponent(dadosFormatados);
        const whatsappURL = `https://api.whatsapp.com/send?phone=${SEU_NUMERO_WHATSAPP}&text=${mensagemCodificada}`;

        window.open(whatsappURL, '_blank'); 

        alert(`Sua solicitação (ID: ${result.cotacaoId}) foi salva! Você será redirecionado para o WhatsApp!`);

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
        const errorData = await response.json();
        alert(`Erro ao enviar: ${errorData.error || 'Erro desconhecido'}.`);
      }
    } catch (error) {
      console.error('erro de rede ao enviar cotação:', error);
      alert('Verifique se o servidor está funcionando ou com problema de rede.');
    }
  };

  return (
    <div className="cotacao-container">
      <h2>✍️ Solicitar Cotação Personalizada</h2>
      <p>
        Me passe as informações que eu calculo o melhor plano pra você! 
      </p>

      <form onSubmit={handleSubmit} className="cotacao-form">
        
        {/* === Dados Pessoais do Solicitante === */}
        <fieldset className="form-section">
            <legend>Seus Dados</legend>
            
            {/* NOME */}
            <div className="material-input-group">
                <input 
                    type="text" 
                    name="nome" 
                    className="material-input-field" 
                    value={formData.nome} 
                    onChange={handleChange} 
                    placeholder="Ex: João Silva" 
                    required 
                />
                <label className="material-input-label">Nome Completo</label>
            </div>
            
            {/* EMAIL */}
            <div className="material-input-group">
                <input 
                    type="email" 
                    name="email" 
                    className="material-input-field" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="exemplo@email.com" 
                    required 
                />
                <label className="material-input-label">E-mail</label>
            </div>
            
            {/* TELEFONE */}
            <div className="material-input-group">
                <input 
                    type="tel" 
                    name="telefone" 
                    className="material-input-field" 
                    value={formData.telefone} 
                    onChange={handleChange} 
                    placeholder="(XX) 9XXXX-XXXX" 
                    required 
                />
                <label className="material-input-label">Telefone/WhatsApp</label>
            </div>
        </fieldset>

        {/* === Modalidade e Localização === */}
        <fieldset className="form-section">
            <legend>Detalhes da Cotação</legend>
            
            {/* MODALIDADE (SELECT) */}
            <div className="material-input-group">
                <select 
                    name="modalidade" 
                    className="material-input-field" 
                    value={formData.modalidade} 
                    onChange={handleChange} 
                    required
                >
                    <option value="pf">Pessoa Física (PF)</option>
                    <option value="cnpj">Pessoa Jurídica (CNPJ)</option>
                </select>
                <label className="material-input-label">Modalidade do Plano</label>
            </div>
            
            {/* CIDADE */}
            <div className="material-input-group">
                <input 
                    type="text" 
                    name="cidade" 
                    className="material-input-field" 
                    value={formData.cidade} 
                    onChange={handleChange} 
                    placeholder="Sua Cidade" 
                    required 
                />
                <label className="material-input-label">Cidade</label>
            </div>

            {/* BAIRRO */}
            <div className="material-input-group">
                <input 
                    type="text" 
                    name="bairro" 
                    className="material-input-field" 
                    value={formData.bairro} 
                    onChange={handleChange} 
                    placeholder="Seu Bairro" 
                    required 
                />
                <label className="material-input-label">Bairro</label>
            </div>

            {/* NUMERO DE PESSOAS */}
            <div className="material-input-group">
                <input 
                    type="number" 
                    name="numPessoas" 
                    className="material-input-field" 
                    min="1" 
                    max="20"
                    value={formData.numPessoas} 
                    onChange={handlePessoasChange} 
                    required 
                />
                <label className="material-input-label">Quantas Vidas?</label>
            </div>
        </fieldset>

        {/* === Dados de Idade e Saúde por Pessoa === */}
        <fieldset className="form-section">
            <legend>Idade e Saúde dos {formData.numPessoas} Beneficiários</legend>
            
            {formData.idades.map((pessoa, index) => (
              <div key={pessoa.id} className="pessoa-detalhe">
                <h4>Pessoa #{index + 1}</h4>
                
                {/* IDADE */}
                <div className="material-input-group">
                    <input 
                        type="number" 
                        className="material-input-field"
                        min="0"
                        max="99"
                        value={pessoa.idade} 
                        onChange={(e) => handlePessoaDetalheChange(pessoa.id, 'idade', e.target.value)}
                        required
                    />
                    <label className="material-input-label">Idade</label>
                </div>

                {/* DOENÇA PRE EXISTENTE (SELECT) */}
                <div className="material-input-group">
                    <select 
                        className="material-input-field"
                        value={pessoa.preExistente} 
                        onChange={(e) => handlePessoaDetalheChange(pessoa.id, 'preExistente', e.target.value)}
                    >
                        <option value="não">Não</option>
                        <option value="sim">Sim</option>
                    </select>
                    <label className="material-input-label">Tem doença pré-existente?</label>
                </div>

                {/* DETALHE DA DOENÇA (TEXTAREA) */}
                {pessoa.preExistente === 'sim' && (
                    <div className="material-input-group">
                        <textarea 
                            className="material-input-field"
                            value={pessoa.doenca} 
                            onChange={(e) => handlePessoaDetalheChange(pessoa.id, 'doenca', e.target.value)}
                            required={pessoa.preExistente === 'sim'}
                            placeholder="Ex: Diabetes tipo 2, hipertensão..."
                        />
                        <label className="material-input-label doenca-label">Qual a doença/lesão?</label>
                    </div>
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