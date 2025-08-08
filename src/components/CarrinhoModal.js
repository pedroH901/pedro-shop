import React from 'react';
import './CarrinhoModal.css';

function CarrinhoModal({ carrinho, onFechar, onRemoverItem, onAtualizarQuantidade }) {
  
  const total = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Carrinho de Compras</h2>
        {carrinho.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <ul className="carrinho-lista">
            {carrinho.map((item) => (
              <li key={item.id}>
                <span>{item.nome} - R$ {item.preco.toFixed(2)}</span>
                <div className="item-controles">
                  <button onClick={() => onAtualizarQuantidade(item.id, item.quantidade - 1)}>-</button>
                  <span>{item.quantidade}</span>
                  <button onClick={() => onAtualizarQuantidade(item.id, item.quantidade + 1)}>+</button>
                  <button className="btn-remover" onClick={() => onRemoverItem(item.id)}>Remover</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <h3><strong>Total:</strong> R$ {total.toFixed(2).replace('.', ',')}</h3>
        <div className="modal-actions">
            <button className="btn-fechar" onClick={onFechar}>Continuar Comprando</button>
            <button className="btn-finalizar">Finalizar Compra</button>
        </div>
      </div>
    </div>
  );
}

export default CarrinhoModal;