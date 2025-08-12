import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Importe o cliente Supabase

// Seus componentes
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LoginModal from './components/LoginModal';
import ProductList from './components/ProductList';
import CarrinhoModal from './components/CarrinhoModal';
import Footer from './components/Footer';

function App() {
  // --- ESTADOS DE CONTROLE DA UI (INTERFACE) ---
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DOS DADOS (AGORA VINDOS DO SUPABASE) ---
  const [sessao, setSessao] = useState(null);
  const [produtos, setProdutos] = useState([]); // Inicia como array vazio
  const [carrinho, setCarrinho] = useState([]); // Inicia como array vazio

  // --- EFEITOS PARA BUSCAR DADOS E GERENCIAR AUTENTICAÇÃO ---

  // Efeito 1: Gerencia a sessão do usuário em tempo real
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessao(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Efeito 2: Busca os produtos do banco de dados uma vez
  useEffect(() => {
    async function getProdutos() {
      const { data, error } = await supabase.from('produtos').select('*');
      if (error) {
        console.error('Erro ao buscar produtos:', error);
      } else {
        setProdutos(data);
      }
      setLoading(false);
    }
    getProdutos();
  }, []);

  // Efeito 3: Busca o carrinho do usuário sempre que a sessão mudar (login/logout)
  useEffect(() => {
    if (sessao) {
      async function getCarrinho() {
        const { data, error } = await supabase
          .from('carrinho_itens')
          .select('*, produtos(*)') // Pega dados do carrinho e do produto relacionado
          .eq('user_id', sessao.user.id);
        
        if (!error) {
          const carrinhoFormatado = data.map(item => ({
            ...item.produtos,
            quantidade: item.quantidade,
            carrinho_item_id: item.id,
          }));
          setCarrinho(carrinhoFormatado);
        }
      }
      getCarrinho();
    } else {
      setCarrinho([]); // Limpa o carrinho se o usuário fizer logout
    }
  }, [sessao]);

  // --- FUNÇÕES PARA CONTROLAR OS MODAIS ---
  const abrirModalLogin = () => setMostrarModalLogin(true);
  const fecharModalLogin = () => setMostrarModalLogin(false);
  const abrirCarrinho = () => setMostrarCarrinho(true);
  const fecharCarrinho = () => setMostrarCarrinho(false);

  // --- FUNÇÕES DE MANIPULAÇÃO DO BANCO DE DADOS ---

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  const adicionarAoCarrinho = async (produtoAdicionado) => {
    if (!sessao) {
      alert("Você precisa estar logado para adicionar itens ao carrinho!");
      abrirModalLogin();
      return;
    }

    const itemExistente = carrinho.find(item => item.id === produtoAdicionado.id);

    if (itemExistente) {
      // UPDATE: Se o item já existe, apenas incrementa a quantidade
      await supabase
        .from('carrinho_itens')
        .update({ quantidade: itemExistente.quantidade + 1 })
        .eq('id', itemExistente.carrinho_item_id);
    } else {
      // INSERT: Se é um novo item, insere no banco
      await supabase
        .from('carrinho_itens')
        .insert({ user_id: sessao.user.id, produto_id: produtoAdicionado.id, quantidade: 1 });
    }
    
    // Recarrega o carrinho do banco para ter certeza que o estado está sincronizado
    // (Uma abordagem mais otimista seria atualizar o estado localmente também)
    if (sessao) {
      const { data } = await supabase.from('carrinho_itens').select('*, produtos(*)').eq('user_id', sessao.user.id);
      const carrinhoFormatado = data.map(item => ({...item.produtos, quantidade: item.quantidade, carrinho_item_id: item.id}));
      setCarrinho(carrinhoFormatado);
    }
  };

  const removerItemDoCarrinho = async (idProduto) => {
    const itemParaRemover = carrinho.find(item => item.id === idProduto);
    if (!itemParaRemover) return;

    // DELETE: Remove o item do banco usando o ID da tabela carrinho_itens
    await supabase.from('carrinho_itens').delete().eq('id', itemParaRemover.carrinho_item_id);
    
    setCarrinho(prevCarrinho => prevCarrinho.filter(item => item.id !== idProduto));
  };
  
  const atualizarQuantidade = async (idProduto, novaQuantidade) => {
    if (novaQuantidade < 1) {
      removerItemDoCarrinho(idProduto);
      return;
    }
    
    const itemParaAtualizar = carrinho.find(item => item.id === idProduto);
    if (!itemParaAtualizar) return;

    // UPDATE: Atualiza a quantidade no banco de dados
    await supabase
      .from('carrinho_itens')
      .update({ quantidade: novaQuantidade })
      .eq('id', itemParaAtualizar.carrinho_item_id);

    setCarrinho(prevCarrinho =>
      prevCarrinho.map(item =>
        item.id === idProduto ? { ...item, quantidade: novaQuantidade } : item
      )
    );
  };

  // Calcula a contagem total de itens para o ícone do carrinho
  const contagemItensCarrinho = carrinho.reduce((total, item) => total + item.quantidade, 0);

  // --- RENDERIZAÇÃO ---

  return (
    <div>
      <Header
        onAbrirCarrinho={abrirCarrinho}
        onAbrirLogin={abrirModalLogin}
        contagemCarrinho={contagemItensCarrinho}
        sessao={sessao} // Prop nova
        onLogout={handleLogout} // Prop nova
      />
      
      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando produtos...</p>
      ) : (
        <main>
          <HeroSection />
          <ProductList
            produtos={produtos}
            onAdicionarAoCarrinho={adicionarAoCarrinho}
          />
        </main>
      )}

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