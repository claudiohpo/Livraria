import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditarLivroModal from '../../components/EditarLivroModal';
import AbasFiltro from '../../components/AbasFiltro';
import CampoPesquisa from '../../components/CampoPesquisa';
import ProdutoCard from '../../components/ProdutoCard';
import '../../styles/colaborador/ConsultaLivros.css';
import Header from '../../components/Header.jsx';

const ConsultaLivros = () => {
  const [livros, setLivros] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('todos');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState(null);

  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const response = await axios.get('http://localhost:3001/livros');
        const livrosData = response.data;

        const livrosComImagens = await Promise.all(
          livrosData.map(async (livro) => {
            try {
              const imagensResponse = await axios.get(`http://localhost:3001/imagemlivro/por-livro/${livro.id}`);
              const imagensData = imagensResponse.data;
              return { ...livro, imagens: imagensData };
            } catch (error) {
              console.error(`Erro ao buscar imagens do livro ID ${livro.id}`, error);
              return { ...livro, imagens: [] };
            }
          })
        );
        setLivros(livrosComImagens);
      } catch (error) {
        console.error('Erro ao buscar livros:', error);
      }
    };
    fetchLivros();
  }, []);

  const handleAbrirModal = (livro) => {
    setLivroSelecionado(livro);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setLivroSelecionado(null);
  };

  const handleSalvar = async (dados) => {
    try {
      await axios.put(`http://localhost:3001/livros/${dados.id}`, dados);
      const updatedLivros = livros.map(livro => 
        livro.id === dados.id ? dados : livro
      );
      setLivros(updatedLivros);
      handleFecharModal();
    } catch (error) {
      console.error('Erro ao salvar o livro:', error);
    }
  };

  const livrosFiltrados = livros.filter(livro => {
    const termo = termoPesquisa.toLowerCase();
    const ativado = livro.ativo;

    const correspondePesquisa = 
      livro.titulo.toLowerCase().includes(termo) ||
      livro.autor?.nome.toLowerCase().includes(termo) ||
      livro.editora?.nome.toLowerCase().includes(termo);

    if (abaAtiva === 'todos') {
      return correspondePesquisa;
    } else if (abaAtiva === 'ativos') {
      return correspondePesquisa && ativado;
    } else if (abaAtiva === 'inativos') {
      return correspondePesquisa && !ativado;
    }
    return true;
  });

  return (
    <div>
      <Header tipoUsuario="colaborador" />
      <div className="consulta-livros">
        <h1>Consulta de Livros</h1>
        <AbasFiltro 
          abaAtiva={abaAtiva} 
          setAbaAtiva={setAbaAtiva} 
          abas={[{ id: 'todos', label: 'Todos' }, { id: 'ativos', label: 'Ativos' }, { id: 'inativos', label: 'Inativos' }]}
        />
        <CampoPesquisa
          termoPesquisa={termoPesquisa}
          setTermoPesquisa={setTermoPesquisa}
        />
        <div className="livros-container">
          {livrosFiltrados.map((livro) => (
            <ProdutoCard
              key={livro.id}
              id={livro.id}
              capaUrl={livro.imagens?.[0]?.url ?? 'https://via.placeholder.com/150'}
              titulo={livro.titulo}
              autor={livro.autor?.nome}
              editora={livro.editora?.nome}
              preco={livro.valorVenda}
              estoque={livro.estoque?.quantidade}
              onClick={() => handleAbrirModal(livro)}
            />
          ))}
        </div>
      </div>
      {modalAberto && (
        <EditarLivroModal onClose={handleFecharModal} onSave={handleSalvar} livro={livroSelecionado} />
      )}
    </div>
  );
};

export default ConsultaLivros;
