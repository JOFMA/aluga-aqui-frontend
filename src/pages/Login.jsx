import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/items');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', width: '384px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>Entrar</h1>
        
        {error && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#374151', fontWeight: 'bold', marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', color: '#374151', fontWeight: 'bold', marginBottom: '8px' }}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
              required
            />
          </div>
          
          <button
            type="submit"
            style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
          >
            Entrar
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          Não tem conta? <Link to="/register" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}>Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}