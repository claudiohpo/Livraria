import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import InfoSection from '../components/InfoSection.jsx';
import '../styles/Pagamento.css';

const Pagamento = () => {
  const location = useLocation();
  const { itens, subtotal } = location.state || { itens: [], subtotal: 0 };

  const [cupom, setCupom] = useState('');
  const [cuponsAplicados, setCuponsAplicados] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState('cartao');
  const [frete, setFrete] = useState('padrao');
  const [contato, setContato] = useState({
    nome: '',
    email: '',
    telefone: '',
  });
  const [cartao, setCartao] = useState({
    numero: '',
    validade: '',
    nome: '',
    bandeira: 'visa',
  });
  const [cartoesSalvos, setCartoesSalvos] = useState([
    { id: 1, numero: '**** **** **** 1234', bandeira: 'visa' },
    { id: 2, numero: '**** **** **** 5678', bandeira: 'mastercard' },
  ]);

  const [enderecos, setEnderecos] = useState([
    { id: 1, rua: 'Rua A', numero: '123', cidade: 'São Paulo', estado: 'SP', cep: '01234-567' },
    { id: 2, rua: 'Rua B', numero: '456', cidade: 'Rio de Janeiro', estado: 'RJ', cep: '04567-890' },
  ]);

  const [enderecoSelecionado, setEnderecoSelecionado] = useState(enderecos[0].id);
  const [novoEndereco, setNovoEndereco] = useState({
    rua: '',
    numero: '',
    cidade: '',
    estado: '',
    cep: '',
  });
  const [mostrarNovoEndereco, setMostrarNovoEndereco] = useState(false);

  const [pagamentoMultiplo, setPagamentoMultiplo] = useState(false);
  const [pagamentos, setPagamentos] = useState([]);
  const [cartaoSelecionado, setCartaoSelecionado] = useState(null);
  const [valorPagar, setValorPagar] = useState({});
  const [salvarCartao, setSalvarCartao] = useState(false);

  const handleAdicionarEndereco = () => {
    const novoId = enderecos.length + 1;
    setEnderecos([...enderecos, { id: novoId, ...novoEndereco }]);
    setEnderecoSelecionado(novoId);
    setNovoEndereco({ rua: '', numero: '', cidade: '', estado: '', cep: '' });
    setMostrarNovoEndereco(false);
  };

  const valorFrete = frete === 'expresso' ? 20 : 10;
  const total = subtotal + valorFrete;

  const handleAdicionarCartao = () => {
    const novoId = cartoesSalvos.length + 1;
    setCartoesSalvos([...cartoesSalvos, { id: novoId, ...cartao }]);
    setCartao({ numero: '', validade: '', nome: '', bandeira: 'visa' });
  };

  const handleAdicionarPagamento = (valor, cartaoId) => {
    if (valor < 10) {
      alert('O valor mínimo por cartão é R$ 10,00.');
      return;
    }

    const novoPagamento = { cartaoId, valor };
    setPagamentos([...pagamentos, novoPagamento]);
  };

  const handleFinalizarCompra = () => {
    const totalPago = pagamentos.reduce((acc, pagamento) => acc + pagamento.valor, 0);
    if (totalPago !== total) {
      alert('O valor total dos pagamentos não corresponde ao valor da compra.');
      return;
    }

    alert('Compra finalizada com sucesso!');
  };

  const cuponsDisponiveis = {
    COMPREMAIS: 10,
    TROCA23451: 40,
  };

  const handleAplicarCupom = () => {
    if (cuponsAplicados.includes(cupom)) {
      alert('Este cupom já foi aplicado.');
      return;
    }

    if (cuponsDisponiveis[cupom]) {
      setCuponsAplicados([...cuponsAplicados, cupom]);
      setCupom('');
    } else {
      alert('Cupom inválido.');
    }
  };

  const calcularDesconto = () => {
    return cuponsAplicados.reduce((acc, cupom) => acc + cuponsDisponiveis[cupom], 0);
  };

  const totalComDesconto = total - calcularDesconto();

  return (
    <div>
      <Header />
      <Breadcrumb items={[{ label: 'Home', link: '/' }, { label: 'Carrinho', link: '/carrinho' }, { label: 'Pagamento', link: '' }]} />
      <div className="pagamento-container">
        <h1>PAGAMENTO</h1>

        <div className="pagamento-layout">
          {/* Coluna da Esquerda: Formulário de Contato e Pagamento */}
          <div className="coluna-esquerda">
            {/* Formulário de Contato */}
            <div className="formulario-contato">
              <h2>Contato</h2>
              <input
                type="text"
                placeholder="Nome"
                value={contato.nome}
                onChange={(e) => setContato({ ...contato, nome: e.target.value })}
              />
              <input
                type="email"
                placeholder="E-mail"
                value={contato.email}
                onChange={(e) => setContato({ ...contato, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={contato.telefone}
                onChange={(e) => setContato({ ...contato, telefone: e.target.value })}
              />
            </div>

            {/* Endereço de Entrega */}
            <div className="endereco-entrega">
              <h2>Endereço de Entrega</h2>
              <select
                value={enderecoSelecionado}
                onChange={(e) => setEnderecoSelecionado(Number(e.target.value))}
              >
                {enderecos.map((endereco) => (
                  <option key={endereco.id} value={endereco.id}>
                    {`${endereco.rua}, ${endereco.numero} - ${endereco.cidade}, ${endereco.estado} - ${endereco.cep}`}
                  </option>
                ))}
              </select>

              {!mostrarNovoEndereco && (
                <button
                  className="botao-novo-endereco"
                  onClick={() => setMostrarNovoEndereco(true)}
                >
                  Cadastrar Novo Endereço
                </button>
              )}

              {mostrarNovoEndereco && (
                <div className="novo-endereco-formulario">
                  <h3>Cadastrar Novo Endereço</h3>
                  <input
                    type="text"
                    placeholder="Rua"
                    value={novoEndereco.rua}
                    onChange={(e) => setNovoEndereco({ ...novoEndereco, rua: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Número"
                    value={novoEndereco.numero}
                    onChange={(e) => setNovoEndereco({ ...novoEndereco, numero: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Cidade"
                    value={novoEndereco.cidade}
                    onChange={(e) => setNovoEndereco({ ...novoEndereco, cidade: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Estado"
                    value={novoEndereco.estado}
                    onChange={(e) => setNovoEndereco({ ...novoEndereco, estado: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="CEP"
                    value={novoEndereco.cep}
                    onChange={(e) => setNovoEndereco({ ...novoEndereco, cep: e.target.value })}
                  />
                  <button onClick={handleAdicionarEndereco}>Adicionar Endereço</button>
                </div>
              )}
            </div>

            {/* Forma de Pagamento */}
            <div className="forma-pagamento">
              <h2>Forma de Pagamento</h2>

              {formaPagamento === 'cartao' && (
                <div className="cartao-formulario">
                  <h3>Adicionar Cartão</h3>
                  
                  <input
                    type="text"
                    placeholder="Número do Cartão"
                    value={cartao.numero}
                    onChange={(e) => setCartao({ ...cartao, numero: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Validade (MM/AA)"
                    value={cartao.validade}
                    onChange={(e) => setCartao({ ...cartao, validade: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Nome no Cartão"
                    value={cartao.nome}
                    onChange={(e) => setCartao({ ...cartao, nome: e.target.value })}
                  />
                  <select
                    value={cartao.bandeira}
                    onChange={(e) => setCartao({ ...cartao, bandeira: e.target.value })}
                  >
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="elo">Elo</option>
                    <option value="amex">American Express</option>
                  </select>
                  <div className="checkbox-salvar-cartao">
                    <input
                      type="checkbox"
                      id="salvar-cartao"
                      checked={salvarCartao}
                      onChange={(e) => setSalvarCartao(e.target.checked)}
                    />
                    <label htmlFor="salvar-cartao">Salvar cartão para a próxima compra</label>
                  </div>
                  <button onClick={handleAdicionarCartao}>Adicionar Cartão</button>

                  <h3>Cartões Salvos</h3>
                  {cartoesSalvos.map((cartaoSalvo) => (
                    <div key={cartaoSalvo.id} className="cartao-salvo">
                      <label className="cartao-label">
                        <input
                          type="radio"
                          name="cartaoSelecionado"
                          value={cartaoSalvo.id}
                          onChange={() => setCartaoSelecionado(cartaoSalvo.id)}
                        />
                        <span className="cartao-info">{cartaoSalvo.numero} ({cartaoSalvo.bandeira})</span>
                      </label>
                      {pagamentoMultiplo && (
                        <input
                          type="number"
                          placeholder="Valor a pagar"
                          onChange={(e) => setValorPagar({ ...valorPagar, [cartaoSalvo.id]: e.target.value })}
                          onBlur={(e) => handleAdicionarPagamento(Number(e.target.value), cartaoSalvo.id)}
                        />
                      )}
                    </div>
                  ))}


                  <div className="checkbox-pagamento-multiplo">
                    <label> <input
                      type="checkbox"
                      id="pagamento-multiplo"
                      checked={pagamentoMultiplo}
                      onChange={(e) => setPagamentoMultiplo(e.target.checked)}
                    /> <span htmlFor="pagamento-multiplo"></span>
                    Pagar com múltiplos cartões </label>
                  </div>
                </div>
              )}
            </div>

            {/* Frete */}
            <div className="frete">
              <h2>Frete</h2>
              <select
                value={frete}
                onChange={(e) => setFrete(e.target.value)}
              >
                <option value="padrao">Padrão (R$ 10,00)</option>
                <option value="expresso">Expresso (R$ 20,00)</option>
              </select>
            </div>
          </div>

          {/* Coluna da Direita: Resumo do Carrinho e Cupom */}
          <div className="coluna-direita">
            {/* Resumo do Carrinho */}
            <div className="resumo-carrinho">
              <h2>Resumo do Carrinho</h2>
              {itens.map((item, index) => (
                <div key={index} className="resumo-item">
                  <img src={item.capaUrl} alt={item.nome} className="resumo-imagem" />
                  <div className="resumo-detalhes">
                    <p>{item.nome} (x{item.quantidade})</p>
                    <p>R${(item.valorVenda * item.quantidade).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <div className="resumo-total">
                <p>Subtotal: R${subtotal.toFixed(2)}</p>
                <p>Frete: R${valorFrete.toFixed(2)}</p>
                {cuponsAplicados.length > 0 && (
                  <p>Desconto: R${calcularDesconto().toFixed(2)}</p>
                )}
                <p><strong>Total: R${totalComDesconto.toFixed(2)}</strong></p>
              </div>
            </div>

            {/* Cupom de Desconto */}
            <div className="cupom">
              <input
                type="text"
                placeholder="Insira o cupom"
                value={cupom}
                onChange={(e) => setCupom(e.target.value)}
              />
              <button onClick={handleAplicarCupom}>Aplicar</button>
            </div>

            {/* Botão de Finalizar Compra */}
            <button className="finalizar-compra" onClick={handleFinalizarCompra}>
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    <InfoSection />
    </div>
  );
};

export default Pagamento;