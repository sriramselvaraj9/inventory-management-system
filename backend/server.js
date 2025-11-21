const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for development
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Serve static files from React build (for production)
app.use(express.static(path.join(__dirname, 'public')));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Database setup
const dbPath = path.join(__dirname, 'inventory.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    price REAL NOT NULL DEFAULT 0,
    supplier TEXT,
    description TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Inventory history table
  db.run(`CREATE TABLE IF NOT EXISTS inventory_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    action TEXT NOT NULL,
    quantity_change INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id)
  )`);

  // Insert sample data if no products exist
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (!err && row.count === 0) {
      const sampleProducts = [
        ['Laptop Dell XPS 13', 'LAP001', 'Electronics', 25, 899.99, 'Dell Inc', 'High-performance laptop for professionals', null, 'active'],
        ['Wireless Mouse', 'MOU001', 'Electronics', 150, 29.99, 'Logitech', 'Ergonomic wireless mouse', null, 'active'],
        ['Office Chair', 'CHR001', 'Furniture', 45, 199.99, 'Steelcase', 'Comfortable ergonomic office chair', null, 'active'],
        ['Coffee Mug', 'MUG001', 'Office Supplies', 200, 12.99, 'Generic', 'Ceramic coffee mug 12oz', null, 'active'],
        ['Notebook A4', 'NOT001', 'Office Supplies', 300, 4.99, 'Moleskine', 'Professional notebook A4 size', null, 'active']
      ];

      const stmt = db.prepare(`INSERT INTO products (name, sku, category, quantity, price, supplier, description, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      sampleProducts.forEach(product => {
        stmt.run(product);
      });
      stmt.finalize();
      
      console.log('Sample products inserted successfully');
    }
  });
});

// Export database instance for use in routes
module.exports = { db };

// Routes
app.use('/api/products', require('./routes/products'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Inventory Management API is running' });
});

// Catch all handler for React Router (must be after API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
  console.log(`📁 Database: ${dbPath}`);
  console.log('📡 Network Access: Available on local network');
  console.log('🔗 Available endpoints:');
  console.log('   - GET /api/health');
  console.log('   - GET /api/products');
  console.log('   - POST /api/products');
  console.log('   - PUT /api/products/:id');
  console.log('   - DELETE /api/products/:id');
  console.log('   - POST /api/products/import');
  console.log('   - GET /api/products/export');
  
  // Get local IP addresses
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  console.log('\n📱 Access from other devices:');
  
  Object.keys(networkInterfaces).forEach(interfaceName => {
    const addresses = networkInterfaces[interfaceName];
    addresses.forEach(address => {
      if (address.family === 'IPv4' && !address.internal) {
        console.log(`   - http://${address.address}:${PORT}`);
      }
    });
  });
  console.log('\n🔧 Make sure Windows Firewall allows Node.js connections');
});