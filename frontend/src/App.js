import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProductDashboard from './components/ProductDashboard';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">📦 Inventory Management System</h1>
          <p className="app-subtitle">Professional inventory tracking and management</p>
        </div>
      </header>
      
      <main className="app-main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductDashboard />} />
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;