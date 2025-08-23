import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProdutoCard from './ProdutoCard';
import '../styles/ModalPedido.css';

const ModalPedido = ({ pedido, onClose }) => {
  const navigate = useNavigate();
  
  if (!pedido) return null;

  const handleVerProduto = () => {
    navigate(`/tela-produto/${pedido.id}`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Pedido {pedido.status === 'Entregue' ? 'Entregue' : pedido.status}
            {pedido.status === 'Entregue' && (
              <span className="data-entrega">dia {pedido.dataEntrega}</span>
            )}
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="status-bar">
          <div className={`status-step ${pedido.status === 'Em processamento' || pedido.status === 'Em trânsito' || pedido.status === 'Entregue' ? 'active' : ''}`}>
            Processando
          </div>
          <div className={`status-step ${pedido.status === 'Em trânsito' || pedido.status === 'Entregue' ? 'active' : ''}`}>
            Em trânsito
          </div>
          <div className={`status-step ${pedido.status === 'Entregue' ? 'active' : ''}`}>
            Entregue
          </div>
        </div>

        <div className="pedido-info">
          <h4 className="pedido-id">Pedido ID: {pedido.id}</h4>
          
          {/* Adicionando o ProdutoCard */}
          <div className="produto-card-container-modal">
            <ProdutoCard
              id={pedido.id}
              capaUrl={pedido.capaUrl}
              titulo={pedido.titulo}
              autor={pedido.autor}
              preco={pedido.preco}
              estoque={pedido.estoque}
              imagens={pedido.imagens}
              editora={pedido.editora}
              isPedido={true}
            />
          </div>
          
          <div className="produto-detalhes">
            <p className="quantidade">Quantidade: {pedido.quantidade}</p>
            
            <div className="produto-valores">
              <p><span>Sub-total:</span> <span>R${pedido.subTotal.toFixed(2).replace('.', ',')}</span></p>
              <p><span>Frete:</span> <span>R${pedido.frete.toFixed(2).replace('.', ',')}</span></p>
              <p className="total"><span>Total:</span> <span>R${pedido.total.toFixed(2).replace('.', ',')}</span></p>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="action-btn ver-produto" onClick={handleVerProduto}>
            Ver produto
          </button>
          
          <div className="help-actions">
            <h5>Ajuda com a compra</h5>
            <button className="help-btn">
              <span>☺</span> Solicitar troca →
            </button>
            <button className="help-btn">
              <span>☺</span> Pedir ajuda →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPedido;