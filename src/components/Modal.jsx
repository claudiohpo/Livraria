import React, { useState } from 'react';
import '../styles/modal.css';

const Modal = ({ onClose, onSave, livro }) => {
  const [ativo, setAtivo] = useState(livro.ativo);
  const [justificativa, setJustificativa] = useState('');

  const handleSave = () => {
    onSave({ ...livro, ativo, justificativa });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Livro</h2>
        <div className="form-group">
          <label>Status</label>
          <select value={ativo} onChange={(e) => setAtivo(e.target.value === 'true')}>
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>
        <div className="form-group">
          <label>Justificativa</label>
          <textarea 
            value={justificativa} 
            onChange={(e) => setJustificativa(e.target.value)} 
            placeholder="Digite a justificativa"
          />
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
