import React, { useState } from 'react';
import '../styles/FiltrosLivro.css'; // Mantemos o estilo

const FiltrosLivro = ({ onFiltroChange }) => {
  const [autoresSelecionados, setAutoresSelecionados] = useState([]);
  const [editorasSelecionadas, setEditorasSelecionadas] = useState([]);
  const [anosSelecionados, setAnosSelecionados] = useState([]);
  const [faixasDePrecoSelecionadas, setFaixasDePrecoSelecionadas] = useState([]);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [ordenacao, setOrdenacao] = useState('');

  const autores = ['George Orwell', 'J. K. Rowling', 'Machado de Assis', 'Sun Tzu'];
  const editoras = ['Companhia das Letras', 'Rocco', 'Record', 'Intrínseca', 'HarperCollins'];
  const anos = [2023, 2022, 2021, 2020];
  const faixasDePreco = [
    { label: 'R$10–R$30', min: 10, max: 30 },
    { label: 'R$30–R$50', min: 30, max: 50 },
    { label: 'R$50–R$100', min: 50, max: 100 },
    { label: 'R$100–R$150', min: 100, max: 150 },
  ];
  const categorias = ['Ficção', 'Romance', 'Fantasia', 'Clássico', 'Infantil', 'Fábula'];

  const tratarCheckbox = (valor, selecionados, setSelecionados, nomeFiltro) => {
    const atualizados = selecionados.includes(valor)
      ? selecionados.filter((v) => v !== valor)
      : [...selecionados, valor];

    setSelecionados(atualizados);
    onFiltroChange({
      autores: nomeFiltro === 'autores' ? atualizados : autoresSelecionados,
      editoras: nomeFiltro === 'editoras' ? atualizados : editorasSelecionadas,
      anos: nomeFiltro === 'anos' ? atualizados : anosSelecionados,
      faixasDePreco: nomeFiltro === 'faixasDePreco' ? atualizados : faixasDePrecoSelecionadas,
      categorias: nomeFiltro === 'categorias' ? atualizados : categoriasSelecionadas,
      ordenacao,
    });
  };

  const tratarOrdenacao = (event) => {
    const novaOrdenacao = event.target.value;
    setOrdenacao(novaOrdenacao);
    onFiltroChange({
      autores: autoresSelecionados,
      editoras: editorasSelecionadas,
      anos: anosSelecionados,
      faixasDePreco: faixasDePrecoSelecionadas,
      categorias: categoriasSelecionadas,
      ordenacao: novaOrdenacao,
    });
  };

  return (
    <div className="filtros-container">


      <fieldset className="filtro-fieldset">
        <legend className="filtro-legend">Autor</legend>
        <div className="filtro-group">
          {autores.map((autor) => (
            <label key={autor} className="filtro-label">
              <input
                type="checkbox"
                checked={autoresSelecionados.includes(autor)}
                onChange={() => tratarCheckbox(autor, autoresSelecionados, setAutoresSelecionados, 'autores')}
              />
              <span className="filtro-checkbox"></span>
              {autor}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="filtro-fieldset">
        <legend className="filtro-legend">Editora</legend>
        <div className="filtro-group">
          {editoras.map((editora) => (
            <label key={editora} className="filtro-label">
              <input
                type="checkbox"
                checked={editorasSelecionadas.includes(editora)}
                onChange={() => tratarCheckbox(editora, editorasSelecionadas, setEditorasSelecionadas, 'editoras')}
              />
              <span className="filtro-checkbox"></span>
              {editora}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="filtro-fieldset">
        <legend className="filtro-legend">Ano de publicação</legend>
        <div className="filtro-group">
          {anos.map((ano) => (
            <label key={ano} className="filtro-label">
              <input
                type="checkbox"
                checked={anosSelecionados.includes(ano)}
                onChange={() => tratarCheckbox(ano, anosSelecionados, setAnosSelecionados, 'anos')}
              />
              <span className="filtro-checkbox"></span>
              {ano}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="filtro-fieldset">
        <legend className="filtro-legend">Faixa de Preço</legend>
        <div className="filtro-group">
          {faixasDePreco.map((faixa) => (
            <label key={faixa.label} className="filtro-label">
              <input
                type="checkbox"
                checked={faixasDePrecoSelecionadas.includes(faixa.label)}
                onChange={() => tratarCheckbox(faixa.label, faixasDePrecoSelecionadas, setFaixasDePrecoSelecionadas, 'faixasDePreco')}
              />
              <span className="filtro-checkbox"></span>
              {faixa.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="filtro-fieldset">
        <legend className="filtro-legend">Categoria</legend>
        <div className="filtro-group">
          {categorias.map((categoria) => (
            <label key={categoria} className="filtro-label">
              <input
                type="checkbox"
                checked={categoriasSelecionadas.includes(categoria)}
                onChange={() => tratarCheckbox(categoria, categoriasSelecionadas, setCategoriasSelecionadas, 'categorias')}
              />
              <span className="filtro-checkbox"></span>
              {categoria}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="filtro-fieldset">
        <legend className="filtro-legend">Ordenar por</legend>
        <div className="filtro-group">
          <select
            value={ordenacao}
            onChange={tratarOrdenacao}
            className="filtro-select"
          >
            <option value="">Selecione</option>
            <option value="Menor preço">Menor preço</option>
            <option value="Maior preço">Maior preço</option>
            <option value="Mais recentes">Mais recentes</option>
          </select>
        </div>
      </fieldset>
    </div>
  );
};

export default FiltrosLivro;
