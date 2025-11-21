import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:5000/api');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const productsAPI = {
  // Get all products with optional filters
  getProducts: (params = {}) => {
    return api.get('/products', { params });
  },

  // Get single product by ID
  getProduct: (id) => {
    return api.get(`/products/${id}`);
  },

  // Create new product
  createProduct: (productData) => {
    return api.post('/products', productData);
  },

  // Update existing product
  updateProduct: (id, productData) => {
    return api.put(`/products/${id}`, productData);
  },

  // Delete product
  deleteProduct: (id) => {
    return api.delete(`/products/${id}`);
  },

  // Get unique categories
  getCategories: () => {
    return api.get('/products/categories');
  },

  // Import products from CSV
  importProducts: (file) => {
    const formData = new FormData();
    formData.append('csvFile', file);
    return api.post('/products/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Export products to CSV
  exportProducts: () => {
    return api.get('/products/export', {
      responseType: 'blob',
    });
  },

  // Get inventory history for a product
  getProductHistory: (id, params = {}) => {
    return api.get(`/products/${id}/history`, { params });
  },

  // Adjust inventory quantity
  adjustInventory: (id, adjustmentData) => {
    return api.post(`/products/${id}/adjust`, adjustmentData);
  },

  // Health check
  healthCheck: () => {
    return api.get('/health');
  },
};

export default api;