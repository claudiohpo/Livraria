import React, { useState } from 'react';
import Draggable from 'react-draggable';
import lupa from '../images/image10.png';
import filtroIcone from '../images/image 18.png';
import '../styles/CampoPesquisa.css';

const CampoPesquisa = ({
  termoPesquisa,
  setTermoPesquisa,
  filtros = [],
  valoresFiltro = {},
  setValoresFiltro = () => {},
}) => {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const toggleFiltros = () => setMostrarFiltros((prev) => !prev);

  // Função para lidar com mudanças nos checkboxes
  const handleCheckboxChange = (filtroId, valor) => {
    setValoresFiltro((prev) => {
      const currentValues = prev[filtroId] || [];
      
      // Se o valor já está selecionado, remove-o
      if (currentValues.includes(valor)) {
        return {
          ...prev,
          [filtroId]: currentValues.filter(v => v !== valor)
        };
      }
      // Caso contrário, adiciona o valor
      else {
        return {
          ...prev,
          [filtroId]: [...currentValues, valor]
        };
      }
    });
  };

  // Função para limpar todos os filtros de um grupo específico
  const limparFiltros = (filtroId) => {
    setValoresFiltro((prev) => ({
      ...prev,
      [filtroId]: []
    }));
  };

  return (
    <div className="campo-pesquisa">
      <input
        type="text"
        placeholder="Pesquisar..."
        value={termoPesquisa}
        onChange={(e) => setTermoPesquisa(e.target.value)}
      />
      
      {filtros.length > 0 && (
        <button className="botao-filtro" onClick={toggleFiltros}>
          <img src={filtroIcone} alt="Filtros" className="icone-filtro" />
        </button>
      )}

      <button className="botao-lupa">
        <img src={lupa} alt="Pesquisar" className="lupa" />
      </button>

      {mostrarFiltros && filtros.length > 0 && (
        <Draggable>
          <div className="painel-filtros-popup draggable-box">
            {filtros.map((filtro) => (
              <div key={filtro.id} className="filtro-grupo">
                <div className="filtro-cabecalho">
                  <strong>{filtro.titulo}</strong>
                  <button 
                    className="botao-limpar"
                    onClick={() => limparFiltros(filtro.id)}
                  >
                    Limpar
                  </button>
                </div>
                
                {filtro.opcoes.map((op) => (
                  <label key={op.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={(valoresFiltro[filtro.id] || []).includes(op.id)}
                      onChange={() => handleCheckboxChange(filtro.id, op.id)}
                    />
                    <span className="checkbox-custom"></span>
                    {op.label}
                  </label>
                ))}
              </div>
            ))}
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default CampoPesquisa;