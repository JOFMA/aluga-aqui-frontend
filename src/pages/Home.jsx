import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to right, #3b82f6, #a855f7)', color: 'white', textAlign: 'center', padding: '80px 20px' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px' }}>🎁 Aluga-Aqui</h1>
      <p style={{ fontSize: '20px', marginBottom: '32px' }}>Alugue itens de decoração para seus eventos!</p>
      
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/items" style={{ backgroundColor: 'white', color: '#2563eb', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
          Ver Itens
        </Link>
        <Link to="/login" style={{ backgroundColor: '#1f2937', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
          Entrar
        </Link>
        <Link to="/register" style={{ backgroundColor: '#16a34a', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
          Cadastrar
        </Link>
      </div>
    </div>
  );
}