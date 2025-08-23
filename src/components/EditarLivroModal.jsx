
import React, { useState, useEffect } from 'react';
import '../styles/EditarLivroModal.css';

const EditarLivroModal = ({ livro, onClose, onSave }) => {
  const [dadosLivro, setDadosLivro] = useState({
    ...livro,
    autor: livro.autor?.nome || '',
    editora: livro.editora?.nome || '',
    valorVenda: livro.valorVenda || 0,
    estoque: livro.estoque?.quantidade || 0,
    categorias: livro.categorias || [], // Alterado para categorias (plural)
    ano: livro.ano || '',
    edicao: livro.edicao || '',
    isbn: livro.isbn || '',
    numeroPaginas: livro.numeroPaginas || '',
    sinopse: livro.sinopse || '',
    altura: livro.dimensoes?.altura || '',
    largura: livro.dimensoes?.largura || '',
    peso: livro.dimensoes?.peso || '',
    profundidade: livro.dimensoes?.profundidade || '',
    grupoPrecificacao: livro.grupoPrecificacao || '',
    codigoBarras: livro.codigoBarras || '',
    justificativa: '',
    categoriaJustificativa: '',
  });

  const [statusOriginal] = useState(livro.ativo);
  const [statusMudou, setStatusMudou] = useState(false);

  // Hardcoded options
  const categoriasDisponiveis = ['Ficção', 'Não-Ficção', 'Romance', 'Suspense', 'Fantasia', 'Biografia'];
  const categoriasJustificativaDisponiveis = ['Item perdido', 'Item danificado', 'Erro de cadastro', 'Outro'];

  useEffect(() => {
    const ativoString = String(dadosLivro.ativo);
    const originalString = String(statusOriginal);
    setStatusMudou(ativoString !== originalString);
  }, [dadosLivro.ativo, statusOriginal]);

  const handleChange = (e) => {
    const { name, value, options } = e.target;
    if (name === 'categorias') {
      const values = Array.from(options).filter(option => option.selected).map(option => option.value);
      setDadosLivro(prev => ({ ...prev, [name]: values }));
    } else {
      setDadosLivro(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSalvar = () => {
    if (statusMudou && (!dadosLivro.justificativa || !dadosLivro.categoriaJustificativa)) {
      alert('Por favor, preencha a justificativa e a categoria da justificativa para a mudança de status.');
      return;
    }

    const dadosParaSalvar = {
      ...dadosLivro,
      autor: { nome: dadosLivro.autor },
      editora: { nome: dadosLivro.editora },
      estoque: { quantidade: parseInt(dadosLivro.estoque, 10) },
      valorVenda: parseFloat(dadosLivro.valorVenda),
      ativo: dadosLivro.ativo === 'true' || dadosLivro.ativo === true,
      dimensoes: {
        altura: parseFloat(dadosLivro.altura),
        largura: parseFloat(dadosLivro.largura),
        peso: parseFloat(dadosLivro.peso),
        profundidade: parseFloat(dadosLivro.profundidade),
      },
      ano: parseInt(dadosLivro.ano, 10),
      numeroPaginas: parseInt(dadosLivro.numeroPaginas, 10),
    };
    onSave(dadosParaSalvar);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Editar Livro</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="form-grid">
          {/* Campos existentes... */}
          <div className="form-group">
            <label>Título:</label>
            <input type="text" name="titulo" value={dadosLivro.titulo} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Autor:</label>
            <input type="text" name="autor" value={dadosLivro.autor} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Editora:</label>
            <input type="text" name="editora" value={dadosLivro.editora} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Categorias:</label>
            <select name="categorias" multiple value={dadosLivro.categorias} onChange={handleChange} className="multiselect">
              {categoriasDisponiveis.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Ano:</label>
            <input type="number" name="ano" value={dadosLivro.ano} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Edição:</label>
            <input type="text" name="edicao" value={dadosLivro.edicao} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>ISBN:</label>
            <input type="text" name="isbn" value={dadosLivro.isbn} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Nº de Páginas:</label>
            <input type="number" name="numeroPaginas" value={dadosLivro.numeroPaginas} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Grupo de Precificação:</label>
            <input type="text" name="grupoPrecificacao" value={dadosLivro.grupoPrecificacao} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Código de Barras:</label>
            <input type="text" name="codigoBarras" value={dadosLivro.codigoBarras} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Estoque:</label>
            <input type="number" name="estoque" value={dadosLivro.estoque} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Preço:</label>
            <input type="number" name="valorVenda" value={dadosLivro.valorVenda} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Altura (cm):</label>
            <input type="number" name="altura" value={dadosLivro.altura} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Largura (cm):</label>
            <input type="number" name="largura" value={dadosLivro.largura} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Peso (g):</label>
            <input type="number" name="peso" value={dadosLivro.peso} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Profundidade (cm):</label>
            <input type="number" name="profundidade" value={dadosLivro.profundidade} onChange={handleChange} />
          </div>
          <div className="form-group full-width">
            <label>Sinopse:</label>
            <textarea name="sinopse" value={dadosLivro.sinopse} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select name="ativo" value={dadosLivro.ativo} onChange={handleChange}>
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>

          {statusMudou && (
            <>
              <div className="form-group">
                <label>Categoria da Justificativa:</label>
                <select name="categoriaJustificativa" value={dadosLivro.categoriaJustificativa} onChange={handleChange}>
                  <option value="">Selecione...</option>
                  {categoriasJustificativaDisponiveis.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group full-width">
                <label>Justificativa da Mudança de Status:</label>
                <textarea name="justificativa" value={dadosLivro.justificativa} onChange={handleChange} />
              </div>
            </>
          )}
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSalvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default EditarLivroModal;
''
