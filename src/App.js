import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LoginModal from './components/LoginModal';
import ProductList from './components/ProductList';
import CarrinhoModal from './components/CarrinhoModal';
import Footer from './components/Footer';

function App() {
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  
  // O carrinho agora armazena objetos com id, nome, preco, e quantidade
  const [carrinho, setCarrinho] = useState([]);

  // Seus produtos
  const produtos = [
    { id: 1, nome: 'Camisa Gabriel Shop', preco: 59.90 },
    { id: 2, nome: 'Boné Estiloso', preco: 39.90 },
    { id: 3, nome: 'Tênis Urbano', preco: 129.90 },
    { id: 4, nome: 'Relógio Moderno', preco: 259.50 },
    { id: 5, nome: 'Mochila Tech', preco: 99.90 },
  ];

  // Funções para controlar os modais
  const abrirModalLogin = () => setMostrarModalLogin(true);
  const fecharModalLogin = () => setMostrarModalLogin(false);
  const abrirCarrinho = () => setMostrarCarrinho(true);
  const fecharCarrinho = () => setMostrarCarrinho(false);

  // Lógica de carrinho aprimorada
  const adicionarAoCarrinho = (produtoAdicionado) => {
    setCarrinho((prevCarrinho) => {
      const itemExistente = prevCarrinho.find(
        (item) => item.id === produtoAdicionado.id
      );

      if (itemExistente) {
        // Se o item já existe, aumenta a quantidade
        return prevCarrinho.map((item) =>
          item.id === produtoAdicionado.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      } else {
        // Se não existe, adiciona o novo item com quantidade 1
        return [...prevCarrinho, { ...produtoAdicionado, quantidade: 1 }];
      }
    });
  };

  const removerItemDoCarrinho = (idProduto) => {
    setCarrinho((prevCarrinho) =>
      prevCarrinho.filter((item) => item.id !== idProduto)
    );
  };

  const atualizarQuantidade = (idProduto, novaQuantidade) => {
    if (novaQuantidade < 1) {
      // Se a quantidade for menor que 1, remove o item
      removerItemDoCarrinho(idProduto);
    } else {
      setCarrinho((prevCarrinho) =>
        prevCarrinho.map((item) =>
          item.id === idProduto ? { ...item, quantidade: novaQuantidade } : item
        )
      );
    }
  };

  // Calcula a contagem total de itens para o ícone do carrinho
  const contagemItensCarrinho = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  return (
    <div>
      <Header
        onAbrirCarrinho={abrirCarrinho}
        onAbrirLogin={abrirModalLogin}
        contagemCarrinho={contagemItensCarrinho}
      />
      <main>
        <HeroSection />
        <ProductList
          produtos={produtos}
          onAdicionarAoCarrinho={adicionarAoCarrinho}
        />
      </main>

      <Footer />

      {/* Modais são renderizados aqui */}
      {mostrarModalLogin && <LoginModal onClose={fecharModalLogin} />}

      {mostrarCarrinho && (
        <CarrinhoModal
          carrinho={carrinho}
          onFechar={fecharCarrinho}
          onRemoverItem={removerItemDoCarrinho}
          onAtualizarQuantidade={atualizarQuantidade}
        />
      )}
    </div>
  );
}

export default App;