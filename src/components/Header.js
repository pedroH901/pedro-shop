import React from 'react';
import './Header.css';

// O Header agora recebe a sessão do usuário e a função de logout
function Header({ onAbrirCarrinho, onAbrirLogin, contagemCarrinho, sessao, onLogout }) {
  return (
    <header className="app-header">
      <div className="logo">
        <h1>Pedro Shop</h1>
      </div>
      <nav className="navegacao">
        <a href="#inicio">Início</a>
        <a href="#produtos">Produtos</a>

        {/* Lógica condicional: mostra Login ou Logout/email */}
        {sessao ? (
          <>
            <span className="user-email">{sessao.user.email}</span>
            <button className="nav-button" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button className="nav-button" onClick={onAbrirLogin}>Login</button>
        )}
        
        <button className="nav-button cart-button" onClick={onAbrirCarrinho}>
          Carrinho ({contagemCarrinho})
        </button>
      </nav>
    </header>
  );
}

export default Header;