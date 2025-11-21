import React, { useState } from 'react';
import '../styles/SearchFilters.css';

const SearchFilters = ({ filters, categories, onChange, disabled }) => {
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Handle search input with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      onChange({ search: value });
    }, 300);
    
    // Clear previous timeout
    return () => clearTimeout(timeoutId);
  };

  // Handle immediate filter changes
  const handleFilterChange = (field, value) => {
    onChange({ [field]: value });
  };

  // Clear all filters
  const clearFilters = () => {
    setLocalSearch('');
    onChange({
      search: '',
      category: '',
      status: '',
      sortBy: 'name',
      sortOrder: 'ASC'
    });
  };

  // Check if any filters are active
  const hasActiveFilters = localSearch || filters.category || filters.status;

  return (
    <div className="search-filters">
      <div className="filters-row">
        {/* Search Input */}
        <div className="filter-group search-group">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products by name, SKU, or description..."
              value={localSearch}
              onChange={handleSearchChange}
              disabled={disabled}
              className="search-input"
            />
            {localSearch && (
              <button
                type="button"
                className="clear-search"
                onClick={() => {
                  setLocalSearch('');
                  onChange({ search: '' });
                }}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            disabled={disabled}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            disabled={disabled}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>

        {/* Sort Options */}
        <div className="filter-group">
          <label>Sort by:</label>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              onChange({ sortBy, sortOrder });
            }}
            disabled={disabled}
            className="filter-select"
          >
            <option value="name-ASC">Name (A-Z)</option>
            <option value="name-DESC">Name (Z-A)</option>
            <option value="sku-ASC">SKU (A-Z)</option>
            <option value="sku-DESC">SKU (Z-A)</option>
            <option value="category-ASC">Category (A-Z)</option>
            <option value="category-DESC">Category (Z-A)</option>
            <option value="quantity-ASC">Quantity (Low-High)</option>
            <option value="quantity-DESC">Quantity (High-Low)</option>
            <option value="price-ASC">Price (Low-High)</option>
            <option value="price-DESC">Price (High-Low)</option>
            <option value="created_at-DESC">Newest First</option>
            <option value="created_at-ASC">Oldest First</option>
          </select>
        </div>

        {/* Items per page */}
        <div className="filter-group">
          <label>Show:</label>
          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            disabled={disabled}
            className="filter-select filter-select-small"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="filter-label-suffix">per page</span>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="filter-group">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={clearFilters}
              disabled={disabled}
              title="Clear all filters"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          {localSearch && (
            <span className="filter-tag">
              Search: "{localSearch}"
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  onChange({ search: '' });
                }}
                className="filter-tag-remove"
              >
                ×
              </button>
            </span>
          )}
          {filters.category && (
            <span className="filter-tag">
              Category: {filters.category}
              <button
                type="button"
                onClick={() => handleFilterChange('category', '')}
                className="filter-tag-remove"
              >
                ×
              </button>
            </span>
          )}
          {filters.status && (
            <span className="filter-tag">
              Status: {filters.status}
              <button
                type="button"
                onClick={() => handleFilterChange('status', '')}
                className="filter-tag-remove"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;