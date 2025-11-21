import React, { useState, useEffect, useCallback } from 'react';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';
import SearchFilters from './SearchFilters';
import ImportExport from './ImportExport';
import InventoryHistory from './InventoryHistory';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { productsAPI } from '../services/api';
import '../styles/ProductDashboard.css';

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'ASC',
    page: 1,
    limit: 20
  });

  // Fetch products with current filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productsAPI.getProducts(filters);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await productsAPI.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Handle product creation
  const handleCreateProduct = async (productData) => {
    try {
      setError(null);
      await productsAPI.createProduct(productData);
      setShowForm(false);
      await fetchProducts();
      await fetchCategories(); // Refresh categories in case new one was added
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create product');
      throw err;
    }
  };

  // Handle product update
  const handleUpdateProduct = async (id, productData) => {
    try {
      setError(null);
      await productsAPI.updateProduct(id, productData);
      setEditingProduct(null);
      setShowForm(false);
      await fetchProducts();
      await fetchCategories(); // Refresh categories in case new one was added
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update product');
      throw err;
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setError(null);
      await productsAPI.deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete product');
    }
  };

  // Handle inventory adjustment
  const handleInventoryAdjustment = async (id, quantity, reason) => {
    try {
      setError(null);
      await productsAPI.adjustInventory(id, { quantity, reason });
      await fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to adjust inventory');
      throw err;
    }
  };

  // Handle edit button click
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Handle view history
  const handleViewHistory = (productId) => {
    setSelectedProductId(productId);
    setShowHistory(true);
  };

  // Handle import success
  const handleImportSuccess = () => {
    fetchProducts();
    fetchCategories();
  };

  // Cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setError(null);
  };

  return (
    <div className="product-dashboard">
      {/* Header Actions */}
      <div className="dashboard-header">
        <div className="header-left">
          <h2>Product Inventory</h2>
          <div className="stats">
            <span className="stat-item">
              Total Products: <strong>{pagination.totalItems || 0}</strong>
            </span>
            <span className="stat-item">
              Categories: <strong>{categories.length}</strong>
            </span>
          </div>
        </div>
        
        <div className="header-actions">
          <ImportExport onImportSuccess={handleImportSuccess} />
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
            disabled={loading}
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <ErrorMessage 
          message={error} 
          onClose={() => setError(null)}
        />
      )}

      {/* Search and Filters */}
      <SearchFilters
        filters={filters}
        categories={categories}
        onChange={handleFilterChange}
        disabled={loading}
      />

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="main-panel">
          {loading && <LoadingSpinner />}
          
          {!loading && products.length === 0 && !error && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No products found</h3>
              <p>
                {filters.search || filters.category || filters.status
                  ? 'Try adjusting your search filters or add some products to get started.'
                  : 'Add your first product to get started with inventory management.'
                }
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Add First Product
              </button>
            </div>
          )}

          {!loading && products.length > 0 && (
            <>
              <ProductTable
                products={products}
                pagination={pagination}
                filters={filters}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onViewHistory={handleViewHistory}
                onInventoryAdjust={handleInventoryAdjustment}
                onPageChange={handlePageChange}
                onSortChange={(sortBy, sortOrder) => 
                  handleFilterChange({ sortBy, sortOrder })
                }
              />
            </>
          )}
        </div>

        {/* Sidebar for History */}
        {showHistory && (
          <div className="sidebar">
            <InventoryHistory
              productId={selectedProductId}
              onClose={() => setShowHistory(false)}
            />
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ProductForm
              product={editingProduct}
              categories={categories}
              onSubmit={editingProduct ? 
                (data) => handleUpdateProduct(editingProduct.id, data) : 
                handleCreateProduct
              }
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDashboard;