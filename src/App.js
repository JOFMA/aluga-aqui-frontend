import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Items from './pages/Items';
import CreateItem from './pages/CreateItem';
import './App.css';
import ItemDetail from './pages/ItemDetail';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav style={{ backgroundColor: '#2563eb', color: 'white', padding: '16px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', color: 'white' }}>🎁 Aluga-Aqui</Link>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link to="/items" style={{ textDecoration: 'none', color: 'white', padding: '8px 16px' }}>Itens</Link>
              {user ? (
                <>
                  <span>Olá, {user.name}!</span>
                  <button onClick={handleLogout} style={{ backgroundColor: '#dc2626', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={{ textDecoration: 'none', color: 'white', padding: '8px 16px' }}>Entrar</Link>
                  <Link to="/register" style={{ backgroundColor: '#16a34a', color: 'white', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none' }}>Cadastrar</Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Rotas */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/items" element={<Items />} />
          <Route path="/create-item" element={<CreateItem />} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;