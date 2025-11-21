import React, { useState } from 'react';
import '../styles/ProductTable.css';

const ProductTable = ({
  products,
  pagination,
  filters,
  onEdit,
  onDelete,
  onViewHistory,
  onInventoryAdjust,
  onPageChange,
  onSortChange
}) => {
  const [adjustingProduct, setAdjustingProduct] = useState(null);
  const [adjustmentData, setAdjustmentData] = useState({ quantity: '', reason: '' });

  // Handle sorting
  const handleSort = (column) => {
    const newSortOrder = filters.sortBy === column && filters.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    onSortChange(column, newSortOrder);
  };

  // Get sort indicator
  const getSortIndicator = (column) => {
    if (filters.sortBy !== column) return '↕️';
    return filters.sortOrder === 'ASC' ? '↑' : '↓';
  };

  // Handle inventory adjustment
  const handleAdjustmentSubmit = async (e) => {
    e.preventDefault();
    if (!adjustmentData.quantity || adjustmentData.quantity === '0') {
      alert('Please enter a valid quantity adjustment');
      return;
    }

    try {
      await onInventoryAdjust(
        adjustingProduct.id,
        parseInt(adjustmentData.quantity),
        adjustmentData.reason || 'Manual adjustment'
      );
      setAdjustingProduct(null);
      setAdjustmentData({ quantity: '', reason: '' });
    } catch (err) {
      // Error is handled by parent component
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'discontinued': return 'status-discontinued';
      default: return 'status-unknown';
    }
  };

  // Get low stock indicator
  const isLowStock = (quantity) => quantity < 10;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const { currentPage, totalPages } = pagination;
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ←
      </button>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="pagination-btn"
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className="pagination-btn"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        →
      </button>
    );

    return pages;
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="product-table-container">
      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Product Name {getSortIndicator('name')}
              </th>
              <th onClick={() => handleSort('sku')} className="sortable">
                SKU {getSortIndicator('sku')}
              </th>
              <th onClick={() => handleSort('category')} className="sortable">
                Category {getSortIndicator('category')}
              </th>
              <th onClick={() => handleSort('quantity')} className="sortable">
                Quantity {getSortIndicator('quantity')}
              </th>
              <th onClick={() => handleSort('price')} className="sortable">
                Price {getSortIndicator('price')}
              </th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className={isLowStock(product.quantity) ? 'low-stock' : ''}>
                <td className="product-name">
                  <div>
                    <strong>{product.name}</strong>
                    {product.description && (
                      <div className="product-description">{product.description}</div>
                    )}
                  </div>
                </td>
                <td className="product-sku">{product.sku}</td>
                <td className="product-category">
                  <span className="category-badge">{product.category}</span>
                </td>
                <td className="product-quantity">
                  <div className="quantity-container">
                    <span className={`quantity ${isLowStock(product.quantity) ? 'low-stock' : ''}`}>
                      {product.quantity}
                    </span>
                    {isLowStock(product.quantity) && (
                      <span className="low-stock-warning" title="Low stock warning">⚠️</span>
                    )}
                  </div>
                </td>
                <td className="product-price">{formatCurrency(product.price)}</td>
                <td className="product-supplier">{product.supplier || 'N/A'}</td>
                <td className="product-status">
                  <span className={`status-badge ${getStatusBadgeClass(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="product-actions">
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => onEdit(product)}
                      title="Edit product"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => setAdjustingProduct(product)}
                      title="Adjust inventory"
                    >
                      📊
                    </button>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => onViewHistory(product.id)}
                      title="View history"
                    >
                      📋
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete(product.id)}
                      title="Delete product"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
            {pagination.totalItems} products
          </div>
          <div className="pagination">
            {renderPagination()}
          </div>
        </div>
      )}

      {/* Inventory Adjustment Modal */}
      {adjustingProduct && (
        <div className="modal-overlay">
          <div className="modal-content modal-small">
            <div className="modal-header">
              <h3>Adjust Inventory</h3>
              <button 
                className="modal-close"
                onClick={() => setAdjustingProduct(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="adjustment-info">
                <strong>{adjustingProduct.name}</strong>
                <div>Current quantity: <strong>{adjustingProduct.quantity}</strong></div>
              </div>
              <form onSubmit={handleAdjustmentSubmit}>
                <div className="form-group">
                  <label>Quantity Adjustment:</label>
                  <input
                    type="number"
                    value={adjustmentData.quantity}
                    onChange={(e) => setAdjustmentData(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="Enter +/- amount (e.g., +10, -5)"
                    required
                    autoFocus
                  />
                  <small>Use positive numbers to increase, negative to decrease</small>
                </div>
                <div className="form-group">
                  <label>Reason (optional):</label>
                  <input
                    type="text"
                    value={adjustmentData.reason}
                    onChange={(e) => setAdjustmentData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Reason for adjustment"
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setAdjustingProduct(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Apply Adjustment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;