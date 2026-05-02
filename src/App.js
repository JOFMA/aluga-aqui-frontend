import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Items from './pages/Items';
import CreateItem from './pages/CreateItem';
import ItemDetail from './pages/ItemDetail';
import MyRentals from './pages/MyRentals';
import RentalRequests from './pages/RentalRequests';
import './App.css';

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
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Link to="/items" style={{ textDecoration: 'none', color: 'white', padding: '8px 16px' }}>Itens</Link>
              {user ? (
                <>
                  <Link to="/meus-alugueis" style={{ textDecoration: 'none', color: 'white', padding: '8px 16px' }}>Meus Aluguéis</Link>
                  <Link to="/painel" style={{ textDecoration: 'none', color: 'white', padding: '8px 16px' }}>Painel</Link>
                  <span style={{ opacity: 0.85 }}>Olá, {user.name}!</span>
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
          <Route path="/meus-alugueis" element={<MyRentals />} />
          <Route path="/painel" element={<RentalRequests />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
