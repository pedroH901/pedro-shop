import React from 'react';
import ProductCard from './ProductCard'; // Importe o novo componente
import './ProductList.css';

function ProductList({ produtos, onAdicionarAoCarrinho }) {
  return (
    <div id="produtos" className="produtos-container">
      <h2>Produtos em Destaque</h2>
      <div className="grid-produtos">
        {produtos.map(produto => (
          <ProductCard
            key={produto.id}
            produto={produto}
            onAdicionarAoCarrinho={onAdicionarAoCarrinho}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;