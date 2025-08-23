import React from 'react';

const AbasFiltro = ({ abaAtiva, setAbaAtiva, abas }) => {
  return (
    <div className="abas-filtro">
      {abas.map((aba) => (
        <button
          key={aba.id}
          onClick={() => setAbaAtiva(aba.id)}
          className={abaAtiva === aba.id ? 'ativo' : ''}
        >
          {aba.label}
        </button>
      ))}
    </div>
  );
};

export default AbasFiltro;