const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const { db } = require('../server');

const router = express.Router();

// Multer configuration for file uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Validation middleware
const validateProduct = [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('sku').trim().isLength({ min: 1 }).withMessage('SKU is required'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('supplier').optional().trim(),
  body('description').optional().trim(),
  body('status').optional().isIn(['active', 'inactive', 'discontinued']).withMessage('Invalid status')
];

// Helper function to record inventory history
const recordInventoryHistory = (productId, action, quantityChange, previousQuantity, newQuantity, reason) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO inventory_history (product_id, action, quantity_change, previous_quantity, new_quantity, reason) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [productId, action, quantityChange, previousQuantity, newQuantity, reason],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

// GET /api/products - Get all products with optional filtering and pagination
router.get('/', (req, res) => {
  const { search, category, status, sortBy = 'name', sortOrder = 'ASC', page = 1, limit = 50 } = req.query;
  
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];
  
  // Apply filters
  if (search) {
    query += ' AND (name LIKE ? OR sku LIKE ? OR description LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }
  
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  
  // Apply sorting
  const validSortColumns = ['name', 'sku', 'category', 'quantity', 'price', 'created_at'];
  const validSortOrder = ['ASC', 'DESC'];
  
  if (validSortColumns.includes(sortBy) && validSortOrder.includes(sortOrder.toUpperCase())) {
    query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
  }
  
  // Apply pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);
  query += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);
  
  // Get total count for pagination
  let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
  const countParams = [];
  
  if (search) {
    countQuery += ' AND (name LIKE ? OR sku LIKE ? OR description LIKE ?)';
    const searchTerm = `%${search}%`;
    countParams.push(searchTerm, searchTerm, searchTerm);
  }
  
  if (category) {
    countQuery += ' AND category = ?';
    countParams.push(category);
  }
  
  if (status) {
    countQuery += ' AND status = ?';
    countParams.push(status);
  }
  
  // Execute count query
  db.get(countQuery, countParams, (err, countResult) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Execute main query
    db.all(query, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({
        products: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(countResult.total / parseInt(limit)),
          totalItems: countResult.total,
          itemsPerPage: parseInt(limit)
        }
      });
    });
  });
});

// GET /api/products/categories - Get all unique categories
router.get('/categories', (req, res) => {
  db.all('SELECT DISTINCT category FROM products ORDER BY category', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows.map(row => row.category));
  });
});

// GET /api/products/:id - Get single product
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(row);
  });
});

// POST /api/products - Create new product
router.post('/', validateProduct, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, sku, category, quantity, price, supplier, description, status = 'active' } = req.body;
  
  db.run(
    `INSERT INTO products (name, sku, category, quantity, price, supplier, description, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, sku, category, quantity, price, supplier, description, status],
    function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return res.status(400).json({ error: 'SKU already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      
      // Record initial inventory
      recordInventoryHistory(this.lastID, 'initial_stock', quantity, 0, quantity, 'Initial product creation')
        .catch(console.error);
      
      // Get the created product
      db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json(row);
      });
    }
  );
});

// PUT /api/products/:id - Update product
router.put('/:id', validateProduct, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { id } = req.params;
  const { name, sku, category, quantity, price, supplier, description, status } = req.body;
  
  // Get current product to track inventory changes
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, currentProduct) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!currentProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    db.run(
      `UPDATE products SET name = ?, sku = ?, category = ?, quantity = ?, price = ?, 
       supplier = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [name, sku, category, quantity, price, supplier, description, status, id],
      function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(400).json({ error: 'SKU already exists' });
          }
          return res.status(500).json({ error: err.message });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        // Record inventory history if quantity changed
        if (currentProduct.quantity !== quantity) {
          const quantityChange = quantity - currentProduct.quantity;
          const action = quantityChange > 0 ? 'stock_increase' : 'stock_decrease';
          recordInventoryHistory(id, action, quantityChange, currentProduct.quantity, quantity, 'Product update')
            .catch(console.error);
        }
        
        // Get the updated product
        db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json(row);
        });
      }
    );
  });
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  });
});

// POST /api/products/import - Import products from CSV
router.post('/import', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No CSV file uploaded' });
  }
  
  const results = [];
  const errors = [];
  let rowCount = 0;
  
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      rowCount++;
      
      // Validate required fields
      if (!data.name || !data.sku || !data.category) {
        errors.push(`Row ${rowCount}: Missing required fields (name, sku, category)`);
        return;
      }
      
      // Clean and validate data
      const product = {
        name: data.name.trim(),
        sku: data.sku.trim(),
        category: data.category.trim(),
        quantity: parseInt(data.quantity) || 0,
        price: parseFloat(data.price) || 0,
        supplier: data.supplier ? data.supplier.trim() : null,
        description: data.description ? data.description.trim() : null,
        status: data.status || 'active'
      };
      
      results.push(product);
    })
    .on('end', () => {
      // Clean up uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
      
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      
      // Insert products into database
      const stmt = db.prepare(`
        INSERT INTO products (name, sku, category, quantity, price, supplier, description, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      let successCount = 0;
      let errorCount = 0;
      const importErrors = [];
      
      results.forEach((product, index) => {
        stmt.run([
          product.name, product.sku, product.category, product.quantity,
          product.price, product.supplier, product.description, product.status
        ], function(err) {
          if (err) {
            errorCount++;
            if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
              importErrors.push(`Row ${index + 1}: SKU '${product.sku}' already exists`);
            } else {
              importErrors.push(`Row ${index + 1}: ${err.message}`);
            }
          } else {
            successCount++;
            // Record inventory history for imported products
            recordInventoryHistory(this.lastID, 'import', product.quantity, 0, product.quantity, 'CSV import')
              .catch(console.error);
          }
          
          // Check if all products have been processed
          if (successCount + errorCount === results.length) {
            stmt.finalize();
            res.json({
              message: `Import completed. ${successCount} products imported successfully.`,
              successCount,
              errorCount,
              errors: importErrors
            });
          }
        });
      });
      
      if (results.length === 0) {
        res.json({ message: 'No valid products found in CSV file', successCount: 0, errorCount: 0 });
      }
    })
    .on('error', (err) => {
      // Clean up uploaded file
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
      });
      res.status(500).json({ error: 'Error processing CSV file: ' + err.message });
    });
});

// GET /api/products/export - Export products to CSV
router.get('/export', (req, res) => {
  db.all('SELECT * FROM products ORDER BY name', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Create CSV content
    const headers = ['name', 'sku', 'category', 'quantity', 'price', 'supplier', 'description', 'status'];
    let csvContent = headers.join(',') + '\n';
    
    rows.forEach(row => {
      const values = headers.map(header => {
        let value = row[header] || '';
        // Escape quotes and wrap in quotes if contains comma or quote
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
      });
      csvContent += values.join(',') + '\n';
    });
    
    // Set headers for file download
    const filename = `products_export_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);
  });
});

// GET /api/products/:id/history - Get inventory history for a product
router.get('/:id/history', (req, res) => {
  const { id } = req.params;
  const { limit = 50 } = req.query;
  
  db.all(
    `SELECT * FROM inventory_history WHERE product_id = ? ORDER BY created_at DESC LIMIT ?`,
    [id, parseInt(limit)],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// POST /api/products/:id/adjust - Adjust inventory quantity
router.post('/:id/adjust', [
  body('quantity').isInt().withMessage('Quantity must be an integer'),
  body('reason').optional().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { id } = req.params;
  const { quantity, reason = 'Manual adjustment' } = req.body;
  
  // Get current product
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const newQuantity = product.quantity + quantity;
    
    if (newQuantity < 0) {
      return res.status(400).json({ error: 'Adjustment would result in negative inventory' });
    }
    
    // Update product quantity
    db.run(
      'UPDATE products SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newQuantity, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        // Record inventory history
        const action = quantity > 0 ? 'adjustment_increase' : 'adjustment_decrease';
        recordInventoryHistory(id, action, quantity, product.quantity, newQuantity, reason)
          .then(() => {
            // Get updated product
            db.get('SELECT * FROM products WHERE id = ?', [id], (err, updatedProduct) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              res.json(updatedProduct);
            });
          })
          .catch(err => {
            console.error('Error recording inventory history:', err);
            res.status(500).json({ error: 'Quantity updated but failed to record history' });
          });
      }
    );
  });
});

module.exports = router;