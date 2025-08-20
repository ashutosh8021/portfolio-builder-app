# Deploy to Render (100% Free)

Render offers completely free hosting for static sites and web services.

## 🌟 Step-by-Step Render Deployment

### 1. Prepare for Render

Create `render.yaml` in root directory:

```yaml
services:
  - type: web
    name: portfolio-backend
    env: node
    buildCommand: cd backend-node && npm install
    startCommand: cd backend-node && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: portfolio-db
          property: connectionString
    
  - type: web
    name: portfolio-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: ./frontend/dist/portfolio-builder
    routes:
      - type: rewrite
        source: /api/*
        destination: https://portfolio-backend.onrender.com/api/*
      - type: rewrite
        source: /*
        destination: /index.html

databases:
  - name: portfolio-db
    databaseName: portfolio_builder
    user: portfolio_user
```

### 2. Update Backend for Render

Create `backend-node/package.json` scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "build": "npm install"
  }
}
```

### 3. Environment Configuration

Update `backend-node/models/database.js`:

```javascript
const sequelize = process.env.DATABASE_URL ? 
  new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }) : null;
```

### 4. Frontend Build Configuration

Update `frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://portfolio-backend.onrender.com/api'
};
```

### 5. Deployment Steps

1. **Sign up at Render**: https://render.com
2. **Connect GitHub**: Link your repository
3. **Create Web Service**:
   - Repository: Your GitHub repo
   - Branch: main
   - Build Command: `cd backend-node && npm install`
   - Start Command: `cd backend-node && npm start`
4. **Create Static Site**:
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist/portfolio-builder`
5. **Add PostgreSQL Database**:
   - Free tier includes PostgreSQL
   - Auto-connects via DATABASE_URL

### 6. Custom Domain (Optional)

- Free `.onrender.com` subdomain included
- Custom domain available on paid plans

## 💰 Cost: 100% Free
## 🌐 Domain: Free .onrender.com subdomain
## 📊 Database: Free PostgreSQL (90 days)
## 🔧 Auto-deploy: On git push
## ⚡ Features: SSL, CDN, Auto-scaling
