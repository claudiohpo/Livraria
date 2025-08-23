import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';
import Header from '../components/Header.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import { useAuth } from '../context/AuthLogin.jsx';
import '../styles/TelaProduto.css';
import axios from 'axios';
import InfoSection from '../components/InfoSection.jsx';

const TelaProduto = () => {
  const { id } = useParams(); // pega o id da URL
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { adicionarAoCarrinho, setClienteId } = useCarrinho();


  const [livro, setLivro] = useState(null);
  const [descricaoExpandida, setDescricaoExpandida] = useState(true);
  const [quantidade, setQuantidade] = useState(1);
  const [imagemPrincipal, setImagemPrincipal] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLivro(null);
    
    const buscarLivro = async () => {
      try {
        // 1. Busca os dados básicos do livro
        const livroResponse = await axios.get(`http://localhost:3001/livros/${id}`);
        
        if (!isMounted) return;
  
        // 2. Requisições em paralelo para imagens e estoque
        const [imagensResponse, estoqueResponse] = await Promise.all([
          axios.get(`http://localhost:3001/imagemlivro/por-livro/${id}`)
            .catch(error => {
              console.error('Erro ao buscar imagens:', error);
              return { data: [] };
            }),
            
          axios.get(`http://localhost:3001/estoques/por-livro/${id}`)
            .then(response => {
              console.log('Dados completos do estoque:', response.data);
              return response;
            })
            .catch(error => {
              console.error('Erro ao buscar estoque:', error);
              return { data: { quantidade: 0 } };
            })
        ]);
  
        // 3. Processa as respostas
        const imagens = imagensResponse.data || [];
        
        // Verifica diferentes estruturas possíveis de resposta do estoque
        let estoque = 0;
        if (estoqueResponse.data) {

          if (Array.isArray(estoqueResponse.data)) {
            // Se a resposta for um array, soma as quantidades
            estoque = estoqueResponse.data.reduce((total, item) => total + (item.quantidade || 0), 0);
          } else if (estoqueResponse.data.quantidade !== undefined) {
            // Se a resposta for um objeto com propriedade quantidade
            estoque = estoqueResponse.data.quantidade;
          }
        }
  
        console.log('Quantidade em estoque calculada:', estoque);
  
        // 4. Atualiza o estado
        if (isMounted) {
          setLivro({
            ...livroResponse.data,
            imagens,
            estoque
          });
          
          if (imagens.length > 0) {
            setImagemPrincipal(imagens[0].caminho || imagens[0].url || '');
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do livro:', error);
      }
    };
    
    buscarLivro();
    
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!livro) {
    return <div>Carregando livro...</div>;
  }

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Livros', link: '/livros' },
    { label: livro.titulo, link: '' },
  ];

  const toggleDescricao = () => {
    setDescricaoExpandida(!descricaoExpandida);
  };

  const handleMudarImagemPrincipal = (img) => {
    setImagemPrincipal(img);
  };

const handleAdicionarAoCarrinho = () => {
  if (quantidade > livro.estoque) {
    alert(`Quantidade solicitada excede o estoque disponível (${livro.estoque})`);
    return;
  }

  const itemCarrinho = {
    id: livro.id,
    titulo: livro.titulo,
    autor: livro.autor?.nome || 'Autor desconhecido',
    editora: livro.editora?.nome || 'Editora desconhecida',
    capaUrl: livro.imagens?.[0]?.url || livro.imagens?.[0]?.caminho || '',
    valorVenda: livro.valorVenda ,
    isbn: livro.isbn || '',
    quantidade: quantidade
  };

  // Usar a função do contexto para atualizar o estado
  adicionarAoCarrinho(itemCarrinho);
  
  // Navegar para o carrinho
  navigate('/carrinho');
};
  console.log("ID da URL:", id, "Livro carregado:", livro?.titulo);


  return (
    <div>
      
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <div className="produto-container">
        <div className="produto-imagens">
                <div className="produto-miniaturas">
          {livro.imagens?.map((img, index) => (
            <img
              key={index}
              src={img.caminho || img.url} // Suporta ambos os nomes de campo
              alt={`Miniatura ${index}`}
              className="miniatura"
              onClick={() => handleMudarImagemPrincipal(img.caminho || img.url)}
            />
          ))}
        </div>
          <div className="produto-imagem-principal">
            <img src={imagemPrincipal} alt={livro.titulo} />
          </div>
        </div>

        <div className="produto-detalhes">
          <h1>{livro.titulo}</h1>
        
          <p className="produto-preco">
  R$ {typeof parseFloat(livro?.valorVenda) === 'number' ? parseFloat(livro.valorVenda).toFixed(2) : '0,00'}
</p>

          <p className="produto-estoque">Apenas {parseFloat(livro?.estoque)} item(s) restantes no estoque!</p>

          <p><strong>Autor:</strong> {livro.autor?.nome}</p>
          <p><strong>Editora:</strong> {livro.editora?.nome}</p>

          <div className="produto-quantidade">
            <label>Quantidade:</label>
            <div className="quantidade-controle">
            <input
              type="number"
              min="1"
              max={livro?.estoque ?? 1}
              value={quantidade}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10) || 1;
                const maxQuantity = livro?.estoque ?? 1;
                setQuantidade(Math.max(1, Math.min(value, maxQuantity)));
              }}
            />
            </div>
          </div>

          <button
            className="produto-botao"
            onClick={handleAdicionarAoCarrinho}
            disabled={usuario?.tipoUsuario === 'colaborador'}
          >
            Adicionar ao carrinho
          </button>

          <div className="produto-info">
            <p><strong>Estimativa de entrega:</strong> Jul 30 - Ago 03</p>
            <p><strong>Entregas e devoluções grátis:</strong> Compras acima de R$75,00</p>
          </div>

          <div className="produto-seguranca">
            <img src="/src/images/Payment Options.png" alt="Formas de pagamento" />
          </div>
        </div>
      </div>

      <div className="produto-descricao">
        <div className="produto-descricao-header" onClick={toggleDescricao}>
          <h2>Descrição do Produto</h2>
          <span className={`seta-descricao ${descricaoExpandida ? 'virada' : ''}`}>▼</span>
        </div>

        <div
          className="produto-descricao-conteudo"
          style={{
            maxHeight: descricaoExpandida ? '500px' : '0',
            opacity: descricaoExpandida ? 1 : 0
          }}
        >
          <p><strong>Categoria(s):</strong> {livro.categorias?.map(cat => cat.nome).join(', ') || 'Não especificada'}</p>
          <p><strong>ISBN:</strong> {livro.isbn || 'Não especificado'}</p>
          <p><strong>Edição:</strong> {livro.edicao || 'Não especificada'}</p>
          <p><strong>Páginas:</strong> {livro.paginas || 'Não especificado'}</p>
          <p><strong>Ano de publicação:</strong> {livro.ano || 'Não especificado'}</p>
          <p><strong>Sinopse:</strong> {livro.sinopse || 'Não especificada'}</p>
          <p>
          <strong>Dimensões (AxLxP):</strong>
          {typeof parseFloat(livro?.altura) === 'number' ? `${parseFloat(livro.altura).toFixed(2)}cm` : 'Não especificada'} x
          {typeof parseFloat(livro?.largura) === 'number' ? `${parseFloat(livro.largura).toFixed(2)}cm` : 'Não especificada'} x
          {typeof parseFloat(livro?.profundidade) === 'number' ? `${parseFloat(livro.profundidade).toFixed(2)}cm` : 'Não especificada'}
        </p>
          <p><strong>Código de Barras:</strong> {livro.codigoBarras || 'Não especificado'}</p>
          {livro.descricao && <p>{livro.descricao}</p>} {/* Mantendo a descrição original */}
        </div>
      </div>

      <div className="produto-beneficios">
        <div>
          <img src="/src/images/img-qualidade.png" alt="Alta Qualidade" />
          <p>Alta Qualidade<br /><span>Impressão premium e encadernação durável</span></p>
        </div>
        <div>
          <img src="/src/images/img-prot-garantida.png" alt="Proteção de garantia" />
          <p>Proteção de garantia<br /><span>Até 2 anos</span></p>
        </div>
        <div>
          <img src="/src/images/img-frete-gratis.png" alt="Frete grátis" />
          <p>Frete grátis<br /><span>Compras superiores a R$150</span></p>
        </div>
        <div>
          <img src="/src/images/img-24-7.png" alt="24/7 Suporte" />
          <p>24/7 Suporte<br /><span>Suporte dedicado</span></p>
        </div>
      </div>
    <InfoSection />
    </div>
  );
};

export default TelaProduto;
