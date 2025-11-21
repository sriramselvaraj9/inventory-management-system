import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import '../styles/InventoryHistory.css';

const InventoryHistory = ({ productId, onClose }) => {
  const [history, setHistory] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
    fetchProduct();
  }, [productId]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await productsAPI.getProductHistory(productId, { limit: 100 });
      setHistory(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch inventory history');
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getProduct(productId);
      setProduct(response.data);
    } catch (err) {
      console.error('Failed to fetch product details:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'initial_stock': return '📦';
      case 'stock_increase': return '⬆️';
      case 'stock_decrease': return '⬇️';
      case 'adjustment_increase': return '➕';
      case 'adjustment_decrease': return '➖';
      case 'import': return '📤';
      default: return '📋';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'initial_stock':
      case 'stock_increase':
      case 'adjustment_increase':
      case 'import':
        return 'positive';
      case 'stock_decrease':
      case 'adjustment_decrease':
        return 'negative';
      default:
        return 'neutral';
    }
  };

  const formatActionName = (action) => {
    return action.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="inventory-history">
      <div className="history-header">
        <div className="header-content">
          <h3>Inventory History</h3>
          {product && (
            <div className="product-info">
              <div className="product-name">{product.name}</div>
              <div className="product-details">
                SKU: {product.sku} | Current Stock: {product.quantity}
              </div>
            </div>
          )}
        </div>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="history-content">
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading history...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <div className="error-message">{error}</div>
            <button onClick={fetchHistory} className="btn btn-sm btn-primary">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="empty-history">
            <div className="empty-icon">📋</div>
            <p>No inventory history found for this product.</p>
          </div>
        )}

        {!loading && !error && history.length > 0 && (
          <div className="history-timeline">
            {history.map((entry) => (
              <div key={entry.id} className="history-item">
                <div className="history-icon">
                  <span className={`action-icon ${getActionColor(entry.action)}`}>
                    {getActionIcon(entry.action)}
                  </span>
                </div>
                <div className="history-content-item">
                  <div className="history-header-item">
                    <span className="action-name">
                      {formatActionName(entry.action)}
                    </span>
                    <span className="action-time">
                      {formatDate(entry.created_at)}
                    </span>
                  </div>
                  <div className="history-details">
                    <div className="quantity-change">
                      <span className="quantity-label">Quantity Change:</span>
                      <span className={`quantity-value ${entry.quantity_change >= 0 ? 'positive' : 'negative'}`}>
                        {entry.quantity_change >= 0 ? '+' : ''}{entry.quantity_change}
                      </span>
                    </div>
                    <div className="quantity-transition">
                      <span>{entry.previous_quantity}</span>
                      <span className="arrow">→</span>
                      <span className="new-quantity">{entry.new_quantity}</span>
                    </div>
                    {entry.reason && (
                      <div className="reason">
                        <span className="reason-label">Reason:</span>
                        <span className="reason-text">{entry.reason}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && !error && history.length > 0 && (
        <div className="history-footer">
          <div className="history-stats">
            <span>Total entries: {history.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryHistory;