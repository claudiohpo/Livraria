import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransacoesCliente = ({ clienteId }) => {
  const [transacoes, setTransacoes] = useState([]);

  // Busca as transações do cliente
  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${clienteId}`)
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
  }, [clienteId]);

  return (
    <div className="transacoes-cliente">
      <h2>Transações do Cliente</h2>
      <table className="tabela-transacoes">
        <thead>
          <tr>
            <th>Data</th>
            <th>Desconto</th>
            <th>Valor Total</th>
            <th>Forma de Pagamento</th>
            <th>Detalhes</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map((transacao) => (
            <tr key={transacao.id}>
              <td>{transacao.data}</td>
              <td>{transacao.desconto}</td>
              <td>{transacao.valorTotal}</td>
              <td>{transacao.formaPagamento}</td>
              <td>
                <button className="detalhes-botao">{transacao.detalhes}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransacoesCliente;