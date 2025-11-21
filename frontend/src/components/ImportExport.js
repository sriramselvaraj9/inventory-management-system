import React, { useState } from 'react';
import { productsAPI } from '../services/api';
import '../styles/ImportExport.css';

const ImportExport = ({ onImportSuccess }) => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  // Handle CSV import
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      const response = await productsAPI.importProducts(file);
      setImportResult(response.data);
      setShowImportModal(true);
      
      if (response.data.successCount > 0) {
        onImportSuccess();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to import CSV file');
    } finally {
      setImporting(false);
      // Reset file input
      e.target.value = '';
    }
  };

  // Handle CSV export
  const handleExport = async () => {
    setExporting(true);

    try {
      const response = await productsAPI.exportProducts();
      
      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `products_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to export products');
    } finally {
      setExporting(false);
    }
  };

  // Download sample CSV template
  const downloadSampleCSV = () => {
    const sampleData = [
      ['name', 'sku', 'category', 'quantity', 'price', 'supplier', 'description', 'status'],
      ['Sample Product 1', 'SAMPLE001', 'Electronics', '50', '29.99', 'Sample Supplier', 'Sample product description', 'active'],
      ['Sample Product 2', 'SAMPLE002', 'Office Supplies', '100', '15.50', 'Another Supplier', 'Another sample product', 'active']
    ];

    const csvContent = sampleData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_products_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="import-export">
        {/* Import Button */}
        <div className="import-section">
          <label htmlFor="csv-import" className="btn btn-outline btn-import">
            {importing ? (
              <>
                <span className="spinner"></span>
                Importing...
              </>
            ) : (
              <>
                📤 Import CSV
              </>
            )}
          </label>
          <input
            id="csv-import"
            type="file"
            accept=".csv"
            onChange={handleImport}
            disabled={importing}
            style={{ display: 'none' }}
          />
        </div>

        {/* Export Button */}
        <button
          className="btn btn-outline btn-export"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? (
            <>
              <span className="spinner"></span>
              Exporting...
            </>
          ) : (
            <>
              📥 Export CSV
            </>
          )}
        </button>

        {/* Sample Template Button */}
        <button
          className="btn btn-outline btn-template"
          onClick={downloadSampleCSV}
          title="Download sample CSV template"
        >
          📋 Sample Template
        </button>
      </div>

      {/* Import Results Modal */}
      {showImportModal && importResult && (
        <div className="modal-overlay">
          <div className="modal-content modal-import-results">
            <div className="modal-header">
              <h3>Import Results</h3>
              <button 
                className="modal-close"
                onClick={() => setShowImportModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="import-summary">
                <div className={`summary-item ${importResult.successCount > 0 ? 'success' : ''}`}>
                  <span className="summary-icon">✅</span>
                  <span className="summary-text">
                    {importResult.successCount} products imported successfully
                  </span>
                </div>
                
                {importResult.errorCount > 0 && (
                  <div className="summary-item error">
                    <span className="summary-icon">❌</span>
                    <span className="summary-text">
                      {importResult.errorCount} products failed to import
                    </span>
                  </div>
                )}
              </div>

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="import-errors">
                  <h4>Import Errors:</h4>
                  <ul className="error-list">
                    {importResult.errors.map((error, index) => (
                      <li key={index} className="error-item">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="import-help">
                <h4>CSV Format Requirements:</h4>
                <ul>
                  <li><strong>Required columns:</strong> name, sku, category</li>
                  <li><strong>Optional columns:</strong> quantity, price, supplier, description, status</li>
                  <li><strong>SKU must be unique</strong> across all products</li>
                  <li><strong>Quantity and price</strong> must be non-negative numbers</li>
                  <li><strong>Status</strong> can be: active, inactive, or discontinued</li>
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={downloadSampleCSV}
              >
                Download Template
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setShowImportModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImportExport;