import React, { useState } from 'react';
import './LoginModal.css';
import { supabase } from '../supabaseClient';

function LoginModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    if (error) {
      setMensagemErro('Login falhou: ' + error.message);
    } else {
      alert('Login realizado com sucesso!');
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />
        {mensagemErro && <p style={{ color: 'red', fontSize: '14px' }}>{mensagemErro}</p>}
        <div className="modal-actions">
          <button
  onClick={async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    });
    if (error) {
      setMensagemErro('Erro no cadastro: ' + error.message);
    } else {
      alert('Usuário registrado! Verifique seu email para confirmação.');
    }
  }}
>
  Registrar
</button>
          <button className="btn-close" onClick={onClose}>Fechar</button>
          <button className="btn-login" onClick={handleLogin}>Entrar</button>
        </div>
      </div>
    </div>
  );
}


export default LoginModal;