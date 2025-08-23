import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
  return (
    <div className="breadcrumb">
      {items.map((item, index) => (
        <span key={index}>
          {index > 0 && ' > '} {/* Adiciona o separador ">" entre os itens */}
          {item.link ? (
            <Link to={item.link}>{item.label}</Link>
          ) : (
            <span>{item.label}</span> // Último item não é um link
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;