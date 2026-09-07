import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <header style={{ backgroundColor: '#0f172a', color: '#f8fafc', padding: '12px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <Link to="/" style={{ display: 'flex', gap: 12, alignItems: 'center', textDecoration: 'none', color: '#f8fafc' }}>
          <img src="https://kommodo.ai/i/WTAOtYvwiP9GnZBrUy1p" alt="StickerLab" style={{ height: 42, borderRadius: 6 }} />
          <span style={{ fontSize: 20, fontWeight: 700 }}>StickerLab</span>
        </Link>

        <nav style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Link to="/items" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Produtos</Link>
          <Link to="/create-item" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Criar</Link>
          <Link to="/contact" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Contato</Link>

          {user ? (
            <>
              <span style={{ color: '#94a3b8' }}>Olá, {user.name}</span>
              <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Entrar</Link>
              <Link to="/register" style={{ backgroundColor: '#0ea5a3', color: '#07123b', padding: '8px 12px', borderRadius: 6, textDecoration: 'none' }}>Cadastrar</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
