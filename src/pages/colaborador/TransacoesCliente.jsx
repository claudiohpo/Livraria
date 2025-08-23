import React, { useState, useEffect } from 'react';
import AbasFiltro from '../../components/AbasFiltro.jsx';
import CampoPesquisa from '../../components/CampoPesquisa.jsx';
import TabelaTransacoes from '../../components/TabelaTransacoes.jsx';
import Header from '../../components/Header.jsx';
import '../../styles/colaborador/TransacoesCliente.css';
import axios from 'axios';

function TransacoesColaborador() {
  
  const [abaAtiva, setAbaAtiva] = useState('todas');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [valoresFiltro, setValoresFiltro] = useState({});

  const [transacoes, setTransacoes] = useState([]); 
  const abas = [
    { id: 'todas', label: 'Todas' },
    { id: 'Cartão Único', label: 'Cartão Único' },
    { id: 'Múltiplos Cartões', label: 'Múltiplos Cartões' },
  ];

  const filtros = [
    {
      id: 'formaPagamento',
      titulo: 'Forma de Pagamento',
      tipo: 'checkbox',
      opcoes: [
        { id: 'Cartão Único', label: 'Cartão Único' },
        { id: 'Múltiplos Cartões', label: 'Múltiplos Cartões' },
      ]
    },
  ];


  // Busca as transações de uma API fictícia
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        const transacoesFormatadas = response.data.map((post) => ({
          id: post.id,
          data: new Date().toLocaleDateString(), // Data fictícia
          desconto: `R$ ${(Math.random() * 50).toFixed(2)}`, // Desconto aleatório
          valorTotal: `R$ ${(Math.random() * 500).toFixed(2)}`, // Valor total aleatório
          formaPagamento: Math.random() > 0.5 ? 'Cartão Único' : 'Múltiplos Cartões', // Forma de pagamento aleatória
          detalhes: 'Ver detalhes', // Link para detalhes
        }));
        setTransacoes(transacoesFormatadas);
      })
      .catch((error) => {
        console.error('Erro ao buscar transações:', error);
      });
  }, []);

  // Filtra as transações com base na aba ativa e no termo de pesquisa
  const filtrarTransacoes = (transacoes) => {
    return transacoes.filter((transacao) => {
      const correspondeAba = abaAtiva === 'todas' || transacao.formaPagamento === abaAtiva;
      const correspondePesquisa =
        transacao.formaPagamento.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        transacao.valorTotal.toLowerCase().includes(termoPesquisa.toLowerCase());

      const correspondeFiltro =
        !valoresFiltro.formaPagamento || transacao.formaPagamento === valoresFiltro.formaPagamento;

      return correspondeAba && correspondePesquisa && correspondeFiltro;
    });
  };



  const transacoesFiltradas = filtrarTransacoes(transacoes);

  return (
    <div>
      <div className="transacoes-colaborador">
       
        <CampoPesquisa
          termoPesquisa={termoPesquisa}
          setTermoPesquisa={setTermoPesquisa}
          filtros={filtros}
          valoresFiltro={valoresFiltro}
          setValoresFiltro={setValoresFiltro}
        />

        <TabelaTransacoes transacoes={transacoesFiltradas} />
      </div>
    </div>
  );
}

export default TransacoesColaborador;