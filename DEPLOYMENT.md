# Inventory Management System - Deployment Guide

## 🚀 Deployment Options

### Option 1: Network Access (Development Mode)
Access from any device on your local network.

### Option 2: Production Build
Optimized build for production deployment.

### Option 3: Docker Deployment
Containerized deployment for any environment.

---

## 📱 Network Access Setup

### Backend Configuration
The backend server is configured to accept connections from any IP address.

### Frontend Configuration
React development server configured for network access.

---

## 🔧 Quick Start Commands

### Start for Network Access:
```bash
# Terminal 1 - Backend
cd backend
npm run start:network

# Terminal 2 - Frontend  
cd frontend
npm run start:network
```

### Build for Production:
```bash
cd frontend
npm run build

cd ../backend
npm run start:prod
```

---

## 📋 Access URLs

### Development Mode:
- **Local**: http://localhost:3001
- **Network**: http://[YOUR-IP]:3001
- **Backend API**: http://[YOUR-IP]:5000

### Production Mode:
- **Application**: http://[YOUR-IP]:5000
- **API**: http://[YOUR-IP]:5000/api

---

## 🔒 Firewall Configuration

### Windows Firewall:
1. Allow Node.js through Windows Firewall
2. Open ports 3001 and 5000
3. Enable network discovery

### Router Configuration:
- Port forwarding for external access
- Static IP assignment (recommended)

---

## 📊 Network Information

Run this command to find your IP address:
```bash
ipconfig | findstr IPv4
```

---

## 🛠️ Troubleshooting

### Cannot Access from Other Devices:
1. Check Windows Firewall settings
2. Verify IP address and ports
3. Ensure devices are on same network
4. Check antivirus/security software

### Performance Issues:
1. Use production build for better performance
2. Enable gzip compression
3. Configure proper caching headers
4. Consider using a reverse proxy (nginx)

---

## 📈 Production Deployment Options

### 1. Local Server
- Windows IIS
- Apache/Nginx
- PM2 Process Manager

### 2. Cloud Platforms
- Heroku
- Vercel (Frontend)
- Railway
- DigitalOcean

### 3. VPS/Dedicated Server
- Ubuntu/CentOS
- Docker containers
- Kubernetes cluster

---

## 🔐 Security Considerations

### Development:
- Only accessible on local network
- No authentication required
- CORS enabled for all origins

### Production:
- Implement authentication
- Use HTTPS
- Configure proper CORS
- Input validation and sanitization
- Rate limiting

---

## 📱 Mobile Access

The application is fully responsive and works on:
- Mobile phones (iOS/Android)
- Tablets
- Desktop computers
- Smart TVs with browsers

---

## 🎯 Next Steps

1. **Test Network Access**: Try accessing from another device
2. **Configure Firewall**: Ensure proper network access
3. **Production Build**: Create optimized version for deployment
4. **Security Setup**: Add authentication if needed
5. **Backup Strategy**: Set up database backups