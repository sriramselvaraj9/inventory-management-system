# Inventory Management System

A web-based inventory management solution designed for small to medium businesses. Built with React and Node.js, this system provides comprehensive inventory tracking, CSV operations, and real-time data management.

## Live Demo
[https://web-production-39bc.up.railway.app](https://web-production-39bc.up.railway.app)

## Features

- **Product Management**: Add, edit, and delete products with detailed information
- **Inventory Tracking**: Real-time stock level monitoring with low stock alerts
- **CSV Operations**: Import and export inventory data in CSV format
- **Search & Filter**: Advanced search functionality by name, category, and status
- **Audit Trail**: Complete history of inventory movements and changes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Data Persistence**: SQLite database for reliable data storage

## Technology Stack

**Backend:**
- Node.js with Express.js framework
- SQLite database for data storage
- Multer for file upload handling
- CSV-parser for data processing
- CORS for cross-origin requests

**Frontend:**
- React 18 with React Router
- Axios for HTTP requests
- Modern CSS with responsive design
- Mobile-first approach

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sriramselvaraj9/inventory-management-system.git
cd inventory-management-system
```

2. Install dependencies:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

3. Start the application:
```bash
# Terminal 1 - Start backend
cd backend
node server.js

# Terminal 2 - Start frontend
cd frontend
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Adding Products
1. Click the "Add Product" button
2. Fill in product details (name, price, stock quantity, category)
3. Optionally upload a product image
4. Click "Save" to add the product to inventory

### CSV Operations
- **Import**: Click "Import CSV" to upload a CSV file with product data
- **Export**: Click "Export CSV" to download current inventory as CSV

### Inventory Management
- View all products in the main dashboard
- Use search and filter options to find specific products
- Click on any product to edit or view details
- Monitor stock levels with built-in low stock alerts

## API Endpoints

- `GET /api/products` - Retrieve all products
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `POST /api/products/import` - Import products from CSV
- `GET /api/products/export` - Export products to CSV
- `GET /api/products/history` - Get inventory history

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please open an issue on GitHub or contact the development team.