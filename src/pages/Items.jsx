import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/items');
      setItems(response.data.items);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px 20px' }}>Carregando...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>🎁 Itens Disponíveis</h1>
          <Link to="/create-item" style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
            + Novo Item
          </Link>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {items.map((item) => (
            <div key={item._id} style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(to right, #3b82f6, #a855f7)', height: '128px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '40px' }}>
                {item.category === 'balões' && '🎈'}
                {item.category === 'painel' && '🎨'}
                {item.category === 'fitas' && '🎀'}
                {item.category === 'confete' && '✨'}
                {!['balões', 'painel', 'fitas', 'confete'].includes(item.category) && '🎁'}
              </div>
              
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{item.name}</h3>
                <p style={{ color: '#6b7280', marginBottom: '16px' }}>{item.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>R$ {item.pricePerDay}/dia</span>
                  <span style={{ fontSize: '12px', backgroundColor: '#e5e7eb', padding: '4px 12px', borderRadius: '4px' }}>{item.quantity} disponíveis</span>
                </div>
                
                <Link to={`/items/${item._id}`} style={{ width: '100%', display: 'block', backgroundColor: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' }}>
                  Ver Detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}