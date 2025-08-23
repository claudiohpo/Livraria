import React from 'react';
import Header from '../components/Header.jsx';
import InfoSection from '../components/InfoSection.jsx';
import ProdutoCard from '../components/ProdutoCard.jsx';
import Banner from '../components/Banner.jsx'; // Importar o novo componente
import '../styles/Home.css';

const Home = () => {
  

  // Mock data for featured books
  const featuredBooks = [
    {
      id: 1,
      titulo: 'O Senhor dos Anéis',
      autor: 'J.R.R. Tolkien',
      preco: '59.90',
      capaUrl: 'https://via.placeholder.com/150/752512/FFFFFF?text=Livro+1',
      estoque: 10,
    },
    {
      id: 2,
      titulo: 'Duna',
      autor: 'Frank Herbert',
      preco: '49.90',
      capaUrl: 'https://via.placeholder.com/150/A73A21/FFFFFF?text=Livro+2',
      estoque: 5,
    },
    {
      id: 3,
      titulo: 'O Guia do Mochileiro das Galáxias',
      autor: 'Douglas Adams',
      preco: '39.90',
      capaUrl: 'https://via.placeholder.com/150/C65338/FFFFFF?text=Livro+3',
      estoque: 0, // Out of stock example
    },
    {
      id: 4,
      titulo: 'A Fundação',
      autor: 'Isaac Asimov',
      preco: '45.00',
      capaUrl: 'https://via.placeholder.com/150/FEAA80/000000?text=Livro+4',
      estoque: 20,
    },
  ];

  // Updated mock data for categories with colors
  const categories = [
    { id: 1, name: 'Ficção Científica', color: 'var(--primary-color)' },
    { id: 2, name: 'Fantasia', color: 'var(--secondary-color)' },
    { id: 3, name: 'Romance', color: 'var(--tertiary-color)' },
    { id: 4, name: 'Mistério', color: 'var(--quaternary-color)' },
  ];

  return (
    <main className="main-content">
      <Header tipoUsuario="cliente" tipoBotao="BotaoLogin" />
      <Banner 
        backgroundColor='#ffebe1'
        image='/src/images/image_banner.png'
        title='Descubra Novas Histórias'
        description='Milhares de títulos esperando por você. Encontre sua próxima leitura favorita!'
        link='/livros'
        linkText='Explorar Livros'
        textColor='#333'
        buttonColor='#852f1b'
        buttonTextColor='#fff'
      />

      {/* Featured Books Section */}
      <section className="home-section">
        <h2 className="home-section-title">Livros em Destaque</h2>
        <div className="produtos-grid">
          {featuredBooks.map(book => (
            <ProdutoCard key={book.id} {...book} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="home-section categories-section">
        <h2 className="home-section-title">Navegue por Categorias</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card" style={{ backgroundColor: category.color }}>
              <h3 className="category-name">{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <InfoSection />
    </main>
  );
};

export default Home
