import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProdutoCard from './ProdutoCard';
import ModalPedido from './ModalPedido';
import '../styles/MeusProdutos.css';

const MeusProdutos = () => {
  const navigate = useNavigate();
  const [statusAtivo, setStatusAtivo] = useState('Em processamento');
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

    const [indicatorStyle, setIndicatorStyle] = useState({
    width: '0px',
    left: '0px'
  });


  useEffect(() => {
    const activeTab = document.querySelector('.status-filtros button.ativo');
    if (activeTab) {
      setIndicatorStyle({
        width: `${activeTab.offsetWidth}px`,
        left: `${activeTab.offsetLeft}px`
      });
    }
  }, [statusAtivo]);




// Função para abrir o modal
const abrirModalPedido = (produto) => {
  setPedidoSelecionado(produto);
};

// Função para fechar o modal
const fecharModal = () => {
  setPedidoSelecionado(null);
};
  

  // Dados mockados - substituir por chamada API no futuro
  const produtosMock = [
    {
      id: 1,
        capaUrl: 'https://m.media-amazon.com/images/I/414U616yzqL._SY445_SX342_.jpg',
        titulo: 'Harry Potter: Cálice de Fogo',
        autor: 'J.K. Rowling',
        preco: 40.50,
        estoque: 10,
        imagens: ['https://m.media-amazon.com/images/I/414U616yzqL._SY445_SX342_.jpg'],
        editora: 'Rocco',
        status: 'Entregue',
        dataEntrega: '24/04',
        quantidade: 1,
        frete: 5.49,
        subTotal: 40.50,
        total: 45.99,
      condicao: 'Novo'
    },
    {
      id: 2,
      capaUrl: 'https://m.media-amazon.com/images/I/51Jj12iMZnL._SY445_SX342_.jpg',
      titulo: 'O Poder do Hábito',
      autor: 'Charles Duhigg',
      preco: 39.90,
      estoque: 5,
      imagens: [
        'https://m.media-amazon.com/images/I/51Jj12iMZnL._SY445_SX342_.jpg',
      ],
      editora: 'Objetiva',
      status: 'Em trânsito',
      dataEntrega: '24/04',
      frete: 5.99,
        quantidade: 1,
        subTotal: 40.50,
        total: 45.99,
      condicao: 'Novo'
    },
    // Adicione mais produtos conforme necessário
  ];

  // Simula carregamento de dados
  useEffect(() => {
    const carregarProdutos = async () => {
      setCarregando(true);
      try {
        // Simulando delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // No futuro, substituir por:
        // const response = await fetch('http://api/meus-produtos');
        // const dados = await response.json();
        // setProdutos(dados);
        
        setProdutos(produtosMock);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setErro('Falha ao carregar produtos. Tente novamente mais tarde.');
      } finally {
        setCarregando(false);
      }
    };

    carregarProdutos();
  }, []);

  // Filtra produtos por status
  const produtosFiltrados = produtos.filter(produto => 
    statusAtivo === 'Todos' || produto.status === statusAtivo
  );

  // Função para navegar para detalhes do produto


  if (carregando) {
    return <div className="carregando">Carregando produtos...</div>;
  }

  if (erro) {
    return <div className="erro">{erro}</div>;
  }

  return (
    <div className="meus-produtos-container">
      {/* Filtros de Status */}
      <div className="status-filtros">
        {['Todos', 'Em processamento', 'Em trânsito', 'Entregue', 'Devoluções/Trocas'].map((status) => (
          <button
            key={status}
            className={statusAtivo === status ? 'ativo' : ''}
            onClick={() => setStatusAtivo(status)}
          >
            {status}
          </button>
          
        ))}
         <div className="status-indicator" style={indicatorStyle} />
      </div>

      {/* Lista de Produtos */}
      <div className="lista-produtos">
        {produtosFiltrados.length > 0 ? (
          produtosFiltrados.map((produto) => (
            <div key={produto.id} className="produto-card-meus-produtos">
              <ProdutoCard
                id={produto.id}
                capaUrl={produto.capaUrl}
                titulo={produto.titulo}
                autor={produto.autor}
                preco={produto.preco}
                estoque={produto.estoque}
                imagens={produto.imagens}
                editora={produto.editora}
                isPedido={true} 
                onClick={() => abrirModalPedido(produto)}
              />
            </div>
     
            
            
          ))
        ) : (
          <div className="sem-produtos">
            <p>Nenhum produto encontrado com o status "{statusAtivo}"</p>

            <img 
              className="image-nenhumProduto" 
              src="src\images\image-nenhumProduto.png" 
              alt="Nenhum produto encontrado"
            />
          
        </div>
       
        )}
      </div>
             {pedidoSelecionado && (
      <ModalPedido 
        pedido={pedidoSelecionado} 
        onClose={fecharModal}
      />
    )}
    </div>
  );
};

export default MeusProdutos;