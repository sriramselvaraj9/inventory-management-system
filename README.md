# 📦 Inventory Management System

![Inventory Management System](https://img.shields.io/badge/Inventory-Management-blue?style=for-the-badge&logo=warehouse)
![React](https://img.shields.io/badge/React-18.0-blue?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.0-green?style=flat-square&logo=node.js)
![SQLite](https://img.shields.io/badge/SQLite-Database-orange?style=flat-square&logo=sqlite)

## 🌐 **Live Demo**: [https://inventory-management-system.vercel.app](https://inventory-management-system.vercel.app)

> **Professional inventory management system with real-time tracking, CSV operations, and responsive design. Perfect for businesses of all sizes.**

---

## ✨ **Key Features**

### 📊 **Inventory Management**
- ✅ Add, Edit, Delete Products  
- ✅ Real-time Stock Level Monitoring
- ✅ Low Stock Warnings & Alerts
- ✅ Product Status Management (Active/Inactive/Discontinued)
- ✅ Supplier & Category Management

### 📤 **Data Operations**
- ✅ CSV Bulk Import with Validation
- ✅ Data Export for Backup/Analysis  
- ✅ Sample CSV Templates
- ✅ Error Handling & Reporting
- ✅ Batch Operations Support

### 🔍 **Search & Filtering**
- ✅ Advanced Search by Name, SKU, Description
- ✅ Filter by Category, Status, Supplier
- ✅ Real-time Search Results
- ✅ Sorting by Multiple Columns
- ✅ Pagination for Large Datasets

### 📱 **Responsive Design**
- ✅ Mobile-Optimized Interface
- ✅ Tablet-Friendly Layout
- ✅ Desktop Full Features
- ✅ Touch-Optimized Controls
- ✅ Cross-Browser Compatible

### 📈 **Reporting & History**
- ✅ Complete Inventory Audit Trail
- ✅ Stock Adjustment History
- ✅ Reason Tracking for Changes
- ✅ Timestamps for All Actions
- ✅ Export History Reports

---

## 🚀 **Quick Start**

### **Option 1: Try Online Demo**
Visit **[https://inventory-management-system.vercel.app](https://inventory-management-system.vercel.app)** - No installation required!

### **Option 2: Run Locally**
```bash
# Clone the repository
git clone https://github.com/yourusername/inventory-management-system.git
cd inventory-management-system

# Start backend
cd backend
npm install
npm start

# Start frontend (new terminal)
cd frontend  
npm install
npm start

# Visit http://localhost:3001
```

### **Option 3: Network Access**
```bash
# Run on local network (accessible from any device)
./start-network.bat  # Windows
# Visit http://[your-ip]:3001 from any device
```

---

## 🛠️ **Technology Stack**

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework  
- **SQLite** - Lightweight database
- **Multer** - File upload handling
- **CSV-Parser** - CSV processing
- **CORS** - Cross-origin support

### **Frontend**  
- **React 18** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Modern styling
- **Responsive Design** - Mobile-first

### **Features**
- **REST API** - Full CRUD operations
- **File Upload** - CSV import support  
- **Real-time Updates** - Live data sync
- **Input Validation** - Data integrity
- **Error Handling** - Robust error management

---

## 📁 **Project Structure**

```
inventory-management-system/
├── backend/                 # Node.js backend
│   ├── server.js           # Main server file
│   ├── routes/             # API routes
│   ├── uploads/            # File uploads
│   └── inventory.db        # SQLite database
├── frontend/               # React frontend  
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── styles/         # CSS styles
│   └── public/             # Static assets
├── docker-compose.yml      # Container deployment
├── vercel.json            # Vercel deployment
└── deploy-to-web.bat      # Easy deployment
```

---

## 🌐 **Deployment Options**

### **🆓 Free Cloud Deployment**

#### **Vercel (Recommended)**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/inventory-management-system)
- **URL**: `https://your-app.vercel.app`
- **Setup**: 1-click deployment
- **Features**: Free HTTPS, Global CDN

#### **Netlify**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/inventory-management-system)
- **URL**: `https://your-app.netlify.app`  
- **Setup**: Connect GitHub repo
- **Features**: Form handling, Functions

#### **Railway**
- **URL**: `https://your-app.up.railway.app`
- **Setup**: Import from GitHub
- **Features**: Full-stack deployment

### **🐳 Docker Deployment**
```bash
docker-compose up -d
# Access at http://localhost:3001
```

### **💼 Custom Domain**
1. Deploy to cloud platform
2. Purchase domain (e.g., `yourbusiness.com`)  
3. Configure DNS settings
4. Access at `https://yourbusiness.com`

---

## 📊 **Sample Data**

The system comes pre-loaded with sample inventory:

| Product | SKU | Category | Stock | Price |
|---------|-----|----------|-------|-------|
| Laptop Dell XPS 13 | LAP001 | Electronics | 25 | $899.99 |
| Wireless Mouse | MOU001 | Electronics | 150 | $29.99 |
| Office Chair | CHR001 | Furniture | 45 | $199.99 |
| Coffee Mug | MUG001 | Office Supplies | 200 | $12.99 |

---

## 🔧 **API Endpoints**

### **Products**
```http
GET    /api/products              # Get all products
POST   /api/products              # Create product  
PUT    /api/products/:id          # Update product
DELETE /api/products/:id          # Delete product
GET    /api/products/categories   # Get categories
```

### **Import/Export**
```http
POST   /api/products/import       # CSV import
GET    /api/products/export       # CSV export
```

### **History**
```http
GET    /api/products/:id/history  # Product history
POST   /api/products/:id/adjust   # Adjust inventory
```

---

## 🎯 **Use Cases**

### **🏪 Retail Stores**
- Track product inventory
- Monitor stock levels
- Generate reports
- Mobile POS integration

### **🏭 Warehouses**  
- Bulk inventory management
- CSV import for large datasets
- Real-time stock updates
- Multi-category organization

### **🏢 Small Businesses**
- Simple inventory tracking  
- Low stock notifications
- Export data for accounting
- Mobile-friendly access

### **📦 E-commerce**
- Product catalog management
- Stock synchronization
- Order fulfillment tracking
- Supplier management

---

## 📱 **Mobile Features**

- **📱 Touch-Optimized**: Finger-friendly buttons and forms
- **📊 Responsive Tables**: Horizontal scrolling for data
- **🔍 Mobile Search**: Quick product lookup
- **📤 Mobile Upload**: Camera/gallery CSV import
- **⚡ Fast Loading**: Optimized for mobile networks

---

## 🔒 **Security Features**

- **Input Validation**: Server-side data validation
- **CORS Protection**: Cross-origin request filtering  
- **File Upload Security**: CSV validation and sanitization
- **SQL Injection Prevention**: Parameterized queries
- **Error Handling**: Secure error messages

---

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 **Show Your Support**

Give a ⭐️ if this project helped you!

[![GitHub stars](https://img.shields.io/github/stars/yourusername/inventory-management-system?style=social)](https://github.com/yourusername/inventory-management-system/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/inventory-management-system?style=social)](https://github.com/yourusername/inventory-management-system/network)

---

## 📞 **Support**

- **📧 Email**: support@inventorymanagement.com
- **🐛 Issues**: [GitHub Issues](https://github.com/yourusername/inventory-management-system/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/yourusername/inventory-management-system/discussions)

---

## 🎉 **Ready to Deploy?**

**[🚀 Deploy Now to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/inventory-management-system)** - Get your public URL in 30 seconds!

**[🌐 Try Live Demo](https://inventory-management-system.vercel.app)** - Test all features online!

---

<div align="center">

**Made with ❤️ for modern businesses**

[🌐 Live Demo](https://inventory-management-system.vercel.app) • [📚 Documentation](./docs) • [🚀 Deploy](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/inventory-management-system)

</div>