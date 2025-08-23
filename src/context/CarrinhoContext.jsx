import React, { createContext, useState, useContext, useEffect } from 'react';

const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children }) => {
  const [itens, setItens] = useState(() => {
    if (typeof window !== 'undefined') {
      const carrinhoSalvo = localStorage.getItem('carrinho');
      return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
    }
    return [];
  });

  // Sincroniza localStorage sempre que itens mudam
  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(itens));
  }, [itens]);

  const adicionarAoCarrinho = (livro) => {
    setItens(prevItens => {
      const itemExistente = prevItens.find((item) => item.id === livro.id);

      if (itemExistente) {
        return prevItens.map((item) =>
          item.id === livro.id
            ? { ...item, quantidade: item.quantidade + (livro.quantidade || 1) }
            : item
        );
      } else {
        return [...prevItens, {
          id: livro.id,
          titulo: livro.titulo,
          autor: livro.autor || 'Não informado',
          capaUrl: livro.capaUrl || livro.imageUrl || '',
          valorVenda: livro.preco || livro.valorVenda,
          quantidade: livro.quantidade || 1,
          editora: livro.editora || 'Não informada'
        }];
      }
    });
  };

  
  const removerDoCarrinho = (id) => {
    const novosItens = itens.filter((item) => item.id !== id);
    setItens(novosItens);
  };

  const atualizarQuantidade = (id, quantidade) => {
    if (quantidade < 1) return;

    const novosItens = itens.map((item) =>
      item.id === id ? { ...item, quantidade } : item
    );
    setItens(novosItens);
  };

  return (
    <CarrinhoContext.Provider
      value={{ 
        itens, 
        adicionarAoCarrinho, 
        removerDoCarrinho, 
        atualizarQuantidade 
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => useContext(CarrinhoContext);