import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import InfoSection from '../components/InfoSection.jsx';
import '../styles/IARecomenda.css';
import iconIA from '../images/img_icon_ia.png';
import iconUser from '../images/img_icon_user.png';

// Função para chamar a API Gemini
async function callGeminiAPI(promptText, apiKey) {
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: promptText
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro da API: ${response.status} - ${errorData.error.message || 'Erro desconhecido'}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível gerar uma resposta.";
    
    return generatedText;

  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    return `Desculpe, houve um erro ao processar sua solicitação: ${error.message}`;
  }
}

const IARecomenda = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [allLivros, setAllLivros] = useState([]);
  const [loadingLivros, setLoadingLivros] = useState(true);
  const [errorLivros, setErrorLivros] = useState(null);

  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const response = await fetch('http://localhost:3001/livros');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllLivros(data);
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
        setErrorLivros("Não foi possível carregar os livros.");
      } finally {
        setLoadingLivros(false);
      }
    };
    fetchLivros();
  }, []);

  const processarMensagem = (mensagem) => {
    const texto = mensagem.toLowerCase();
    let criterios = {};
    let livrosFiltrados = [...allLivros]; // Começa com todos os livros

    // Mapeamento de sinônimos e termos-chave
    const mapeamentoTermos = {
      'fantasia': { tipo: 'categoria', valor: 'fantasia' },
      'romance': { tipo: 'categoria', valor: 'romance' },
      'clássico': { tipo: 'categoria', valor: 'clássico' },
      'infantil': { tipo: 'categoria', valor: 'infantil' },
      'ficção científica': { tipo: 'categoria', valor: 'ficção científica' },
      'sci-fi': { tipo: 'categoria', valor: 'ficção científica' },
      'terror': { tipo: 'categoria', valor: 'terror' },
      'suspense': { tipo: 'categoria', valor: 'suspense' },
      'biografia': { tipo: 'categoria', valor: 'biografia' },
      'história': { tipo: 'categoria', valor: 'história' },
      'autoajuda': { tipo: 'categoria', valor: 'autoajuda' },
      'poesia': { tipo: 'categoria', valor: 'poesia' },
      'distopia': { tipo: 'categoria', valor: 'distopia' },
      'aventura': { tipo: 'categoria', valor: 'aventura' },
      'jovem adulto': { tipo: 'categoria', valor: 'jovem adulto' },
      'literatura brasileira': { tipo: 'categoria', valor: 'literatura brasileira' },
      'nacional': { tipo: 'categoria', valor: 'literatura brasileira' },
      'estrangeira': { tipo: 'categoria', valor: 'literatura estrangeira' },
      'editora': { tipo: 'prefixo', valor: 'editora' },
      'autor': { tipo: 'prefixo', valor: 'autor' },
      'ano': { tipo: 'prefixo', valor: 'ano' },
      'sobre': { tipo: 'prefixo', valor: 'sinopse' }, // Para buscar na sinopse/título
      'título': { tipo: 'prefixo', valor: 'titulo' },
    };

    // Extrair critérios da mensagem
    for (const termoChave in mapeamentoTermos) {
      if (texto.includes(termoChave)) {
        const { tipo, valor } = mapeamentoTermos[termoChave];
        if (tipo === 'categoria') {
          criterios.categorias = criterios.categorias || [];
          criterios.categorias.push(valor);
        } else if (tipo === 'prefixo') {
          // Tenta extrair o valor após o prefixo
          const regex = new RegExp(`${termoChave}\s+([^,]+)(?:,|$)`, 'i');
          const match = texto.match(regex);
          if (match && match[1]) {
            criterios[valor] = match[1].trim();
          } else {
            // Se não encontrar um valor específico, usa o termo chave como um critério geral
            criterios[valor] = true; 
          }
        }
      }
    }

    // Lógica de filtragem
    if (Object.keys(criterios).length > 0) {
      livrosFiltrados = allLivros.filter(livro => {
        let match = true;

        // Filtrar por categorias
        if (criterios.categorias && criterios.categorias.length > 0) {
          const livroCategorias = livro.categorias ? livro.categorias.map(cat => cat.nome.toLowerCase()) : [];
          match = match && criterios.categorias.every(critCat => livroCategorias.includes(critCat));
        }

        // Filtrar por autor
        if (criterios.autor) {
          match = match && livro.autor && livro.autor.nome.toLowerCase().includes(criterios.autor.toLowerCase());
        }

        // Filtrar por editora
        if (criterios.editora) {
          match = match && livro.editora && livro.editora.nome.toLowerCase().includes(criterios.editora.toLowerCase());
        }

        // Filtrar por ano
        if (criterios.ano) {
          const anoBusca = parseInt(criterios.ano);
          match = match && livro.ano && livro.ano === anoBusca;
        }

        // Filtrar por termos na sinopse ou título (busca geral)
        if (criterios.sinopse && typeof criterios.sinopse === 'string') {
          const termoBusca = criterios.sinopse.toLowerCase();
          match = match && (
            (livro.sinopse && livro.sinopse.toLowerCase().includes(termoBusca)) ||
            (livro.titulo && livro.titulo.toLowerCase().includes(termoBusca))
          );
        } else if (criterios.sinopse === true) { // Se 'sobre' foi mencionado sem um termo específico
            // Isso significa que o usuário quer uma busca mais ampla, mas sem um termo específico
            // Poderíamos retornar os mais populares ou uma amostra. Por enquanto, não filtra por isso.
        }
        
        // Filtrar por título exato
        if (criterios.titulo && typeof criterios.titulo === 'string') {
          match = match && livro.titulo && livro.titulo.toLowerCase().includes(criterios.titulo.toLowerCase());
        }

        return match;
      });
    }

    return livrosFiltrados;
  };

  

  const handleSendMessage = async () => { // Adicionado 'async'
    if (inputValue.trim() === '') return;

    const userMessage = { text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue(''); // Limpa o input imediatamente

    // Simula um tempo de "digitação" da IA
    const typingMessage = { text: 'Digitando...', sender: 'ia', produtos: [] };
    setMessages((prev) => [...prev, typingMessage]);

    const API_KEY = "AIzaSyA-pW_YMrTkuWkKKf_7-YBBQqIQDKDM2x4"; // Substitua pela sua chave de API

    try {
      const livrosFiltrados = processarMensagem(userMessage.text); // Usa o texto da mensagem do usuário
      
      // Constrói o contexto dos livros para a IA
      const catalogoLivrosContexto = livrosFiltrados.map(livro => 
        `Título: ${livro.titulo}, Autor: ${livro.autor?.nome || 'Desconhecido'}, Editora: ${livro.editora?.nome || 'Desconhecida'}, Categorias: ${livro.categorias?.map(c => c.nome).join(', ') || 'N/A'}, Sinopse: ${livro.sinopse || 'N/A'}`
      ).join('\n---\n');

      const promptParaIA = `Você é um assistente de recomendação de livros. Baseie suas recomendações EXCLUSIVAMENTE nos livros listados abaixo. Se não encontrar um livro que se encaixe, diga que não encontrou. Mantenha suas respostas curtas e conversacionais, a menos que o usuário peça um resumo específico de um livro.\n\nCatálogo de Livros Disponíveis (filtrados pela sua busca inicial):\n${catalogoLivrosContexto}\n\nPergunta do Usuário: "${userMessage.text}"\n\nSua recomendação:`

      const respostaIA = await callGeminiAPI(promptParaIA, API_KEY);

      setMessages((prev) => {
        const newMessages = prev.filter(msg => msg.text !== 'Digitando...'); // Remove a mensagem de "digitando"
        return [...newMessages, { text: respostaIA, sender: 'ia', produtos: livrosFiltrados }];
      });

    } catch (error) {
      console.error("Erro ao processar mensagem da IA:", error);
      setMessages((prev) => {
        const newMessages = prev.filter(msg => msg.text !== 'Digitando...');
        return [...newMessages, { text: "Desculpe, não consegui processar sua solicitação no momento.", sender: 'ia', produtos: [] }];
      });
    }
  };

  const handleProductClick = (livro) => {
    navigate('/tela-produto', { state: { produto: livro } });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  if (loadingLivros) {
    return <div>Carregando recomendações...</div>;
  }

  if (errorLivros) {
    return <div>Erro: {errorLivros}</div>;
  }

  return (
    <div>
      <Header tipoUsuario="cliente" tipoBotao="BotaoLogin" />
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message-container ${message.sender}`}>
              {message.sender === 'ia' && <img src={iconIA} alt="Ícone IA" className="message-icon" />}
              <div className={`message ${message.sender}`}>
                <p>{message.text}</p>
                {message.sender === 'ia' && message.produtos && (
                  <div className="produtos-sugeridos">
                    <div className="imagens-produtos-sugeridos">
                      {message.produtos.map((livro, idx) => (
                        <div
                          key={idx}
                          className="produto-card"
                          onClick={() => handleProductClick(livro)}
                        >
                          <img src={livro.capaUrl || livro.imagens?.[0]?.url} alt={livro.titulo} />
                          <p>{livro.titulo}</p>
                          <span>R${livro.valorVenda}</span>
                        </div>
                      ))}
                    </div>
                    <a href="/livros" className="veja-mais">VER TODOS OS LIVROS</a>
                  </div>
                )}
              </div>
              {message.sender === 'user' && <img src={iconUser} alt="Ícone Usuário" className="message-icon" />}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress} 
            placeholder="Ex: Me mostra livros de fantasia"
          />
          <button onClick={handleSendMessage}>Enviar</button>
        </div>
      </div>
    <InfoSection />
    </div>
  );
};

export default IARecomenda;
