import React from 'react';
import './ProductCard.css';

function ProductCard({ produto, onAdicionarAoCarrinho }) {
  return (
    <div className="produto-card">
      <img src={`https://placehold.co/300x200/eee/333?text=${produto.nome}`} alt={produto.nome} />
      <div className="produto-info">
        <h3>{produto.nome}</h3>
        <p>R$ {produto.preco.toFixed(2).replace('.', ',')}</p>
        <button onClick={() => onAdicionarAoCarrinho(produto)}>
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}

export default ProductCard;