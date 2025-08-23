// ... (imports permanecem os mesmos)
// src/pages/Carrinho.jsx
import React from 'react';
import { useCarrinho } from '../context/CarrinhoContext'; 
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import InfoSection from '../components/InfoSection.jsx';

import '../styles/Carrinho.css'

const Carrinho = () => {
  const { itens, removerDoCarrinho, atualizarQuantidade } = useCarrinho();


  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Carrinho', link: '' },
  ];

  const subtotal = itens.reduce((total, item) => {
    const valorVenda = item.valorVenda || 0;
    return total + (valorVenda * (item.quantidade || 1));
  }, 0);

  return (
    <div>
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <div className="carrinho-container">
        <h1>Meu Carrinho</h1>

        {/* Cabeçalho da tabela */}
        <div className="carrinho-cabecalho">
          <div className="carrinho-coluna-produto">Livro</div>
          <div className="carrinho-coluna-preco">Preço</div>
          <div className="carrinho-coluna-quantidade">Quantidade</div>
          <div className="carrinho-coluna-total">Total</div>
        </div>

        {/* Lista de itens */}
        {itens.length > 0 ? (
          itens.map((item) => {
            const valorVenda = item.valorVenda || 0;
            const quantidade = item.quantidade || 1;
            console.log("Itens no carrinho:", itens);
            return (
              <div key={item.id} className="carrinho-item">
                <div className="carrinho-coluna-produto">
                  <img 
                    src={item.capaUrl || item.imageUrl} 
                    alt={item.titulo || item.nome} 
                    className="carrinho-imagem" 
                  />
                  <div className="carrinho-detalhes-produto">
                    <h3>{item.titulo || item.nome}</h3>
                    <p>{item.autor || 'Não informado'}</p>
                    <button
                      onClick={() => removerDoCarrinho(item.id)}
                      className="carrinho-remover"
                    >
                      Remover
                    </button>
                  </div>
                </div>
                <div className="carrinho-coluna-preco">
                  <p>R${typeof parseFloat(valorVenda) === 'number' ? parseFloat(valorVenda).toFixed(2) : '0,00'}</p>
                </div>
                <div className="carrinho-coluna-quantidade">
                  <input
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={(e) => atualizarQuantidade(item.id, parseInt(e.target.value) || 1)}
                    className="carrinho-quantidade"
                  />
                </div>
                <div className="carrinho-coluna-total">
                  <p>R${(valorVenda * quantidade).toFixed(2)}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p>Seu carrinho está vazio</p>
        )}


        <div className="carrinho-finalizar">
          <div className="carrinho-subtotal">
            <div className="carrinho-subtotal-label">Subtotal</div>
            <div className="carrinho-subtotal-valor">R${subtotal.toFixed(2)}</div>
          </div>
          <Link
            to="/pagamento"
            state={{ itens, subtotal }}
            className="carrinho-botao"
            disabled={itens.length === 0}
          >
            Finalizar compra
          </Link>
        </div>
      </div>
    <InfoSection />
    </div>
  );
};

export default Carrinho;