import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import FiltrosLivro from '../components/FiltrosLivro';
import ProdutoCard from '../components/ProdutoCard';
import '../styles/ShopLivros.css';
import CampoPesquisa from '../components/CampoPesquisa';
import InfoSection from '../components/InfoSection.jsx';

const ShopLivros = () => {
  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Livros', link: '' },
  ];

  const [termoPesquisa, setTermoPesquisa] = useState('');

  const [filtros, setFiltros] = useState({
    autores: [],
    editoras: [],
    anos: [],
    faixasDePreco: [],
    categorias: [],
    ordenacao: '',
  });

  const faixasDePreco = [
    { label: 'R$10–R$30', min: 10, max: 30 },
    { label: 'R$30–R$50', min: 30, max: 50 },
    { label: 'R$50–R$100', min: 50, max: 100 },
    { label: 'R$100–R$150', min: 100, max: 150 },
  ];

  const [livros, setLivros] = useState([]);

  useEffect(() => {
    const buscarLivros = async () => {
      try {
        const response = await fetch('http://localhost:3001/livros');
        const livrosData = await response.json();

        // Para cada livro, buscar as imagens
        const livrosComImagens = await Promise.all(
          livrosData.map(async (livro) => {
            try {
              const imagensResponse = await fetch(`http://localhost:3001/imagemlivro/por-livro/${livro.id}`);
              const imagensData = await imagensResponse.json();
              return { ...livro, imagens: imagensData };
            } catch (error) {
              console.error(`Erro ao buscar imagens do livro ID ${livro.id}`, error);
              return { ...livro, imagens: [] };
            }
          })
        );

        setLivros(livrosComImagens);
      } catch (error) {
        console.error('Erro ao buscar livros', error);
      }
    };

    buscarLivros();
  }, []);


  const termo = termoPesquisa.toLowerCase();
  const filtrarLivros = () => {
    let filtrados = livros.filter((livro) => {
      const termo = termoPesquisa.toLowerCase();
  
      const correspondePesquisa =
        termo === '' ||
        livro.titulo.toLowerCase().includes(termo) ||
        livro.autor?.nome.toLowerCase().includes(termo) ||
        livro.editora?.nome.toLowerCase().includes(termo);
  
      const anoValido =
        filtros.anos.length === 0 || filtros.anos.includes(livro.ano);
  
      const faixaPrecoValida =
        filtros.faixasDePreco.length === 0 ||
        filtros.faixasDePreco.some((faixaLabel) => {
          const faixa = faixasDePreco.find((f) => f.label === faixaLabel);
          return faixa && livro.valorVenda >= faixa.min && livro.valorVenda <= faixa.max;
        });
  
      const categoriaValida =
        filtros.categorias.length === 0 ||
        filtros.categorias.some((cat) => livro.categorias.map(c => c.nome).includes(cat));
  
      return correspondePesquisa && anoValido && faixaPrecoValida && categoriaValida;
    });
  
    switch (filtros.ordenacao) {
      case 'Menor preço':
        filtrados.sort((a, b) => a.valorVenda - b.valorVenda);
        break;
      case 'Maior preço':
        filtrados.sort((a, b) => b.valorVenda - a.valorVenda);
        break;
      case 'Mais recentes':
        filtrados.sort((a, b) => b.ano - a.ano);
        break;
      default:
        break;
    }
  
    return filtrados;
  };
  

  const livrosFiltrados = filtrarLivros();
  

  return (
    <div>
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="shop-titulo">CATÁLOGO DE LIVROS</h1>
      <CampoPesquisa
          termoPesquisa={termoPesquisa}
          setTermoPesquisa={setTermoPesquisa}
          filtros={[]}
          valoresFiltro={[]}
          setValoresFiltro={[]}
        />
      <div className="main-container">
        <FiltrosLivro onFiltroChange={setFiltros} />
        <div className="cards-container">
          {livrosFiltrados.map((livro) => (
            <ProdutoCard
              key={livro.id}
              id={livro.id}
              capaUrl={livro.imagens?.[0]?.url ?? 'https://via.placeholder.com/150'}
              titulo={livro.titulo}
              autor={livro.autor?.nome ?? 'Autor desconhecido'}
              preco={livro.valorVenda}
              estoque={livro.estoque?.reduce((total, item) => total + item.quantidade, 0) ?? 0}
              imagens={livro.imagens ?? []}
              editora={livro.editora?.nome ?? 'Editora desconhecida'}
              extra={null}
            />
          ))}
        </div>
      </div>
    <InfoSection />
    </div>
  );
};

export default ShopLivros;
