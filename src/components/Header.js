import React from 'react';
import './Header.css';

// O Header recebe as funções para abrir o carrinho e o login, e a contagem de itens
function Header({ onAbrirCarrinho, onAbrirLogin, contagemCarrinho }) {
  return (
    <header className="app-header">
      <div className="logo">
        <h1>Pedro Shop</h1>
      </div>
      <nav className="navegacao">
        <a href="#inicio">Início</a>
        <a href="#produtos">Produtos</a>
        <button className="nav-button" onClick={onAbrirLogin}>Login</button>
        <button className="nav-button cart-button" onClick={onAbrirCarrinho}>
          Carrinho ({contagemCarrinho})
        </button>
      </nav>
    </header>
  );
}

export default Header;