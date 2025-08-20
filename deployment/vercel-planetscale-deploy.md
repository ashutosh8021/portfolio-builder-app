# Deploy to Vercel + PlanetScale (Free)

Vercel for frontend + PlanetScale for database = Completely free powerful deployment.

## ⚡ Step-by-Step Vercel + PlanetScale Deployment

### 1. Split Frontend for Vercel

Create `vercel.json` in frontend directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/portfolio-builder"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-backend.herokuapp.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 2. Backend for Heroku (Free Alternative)

Create `backend-node/Procfile`:

```
web: npm start
```

Update `backend-node/package.json`:

```json
{
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  },
  "scripts": {
    "start": "node server.js",
    "postinstall": "npm install"
  }
}
```

### 3. PlanetScale Database Setup

1. **Sign up**: https://planetscale.com
2. **Create database**: `portfolio-builder`
3. **Get connection string**: Copy from dashboard
4. **Update database config**:

```javascript
// backend-node/models/database.js
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});
```

### 4. Environment Variables

**Vercel (Frontend)**:
```
NEXT_PUBLIC_API_URL=https://your-app.herokuapp.com/api
```

**Heroku (Backend)**:
```
NODE_ENV=production
DATABASE_URL=mysql://username:password@host:3306/database
FRONTEND_URL=https://your-app.vercel.app
```

### 5. Deployment Steps

**Frontend (Vercel)**:
1. Sign up at Vercel: https://vercel.com
2. Import GitHub repository (frontend folder)
3. Auto-deploys on git push
4. Get URL: `https://your-app.vercel.app`

**Backend (Heroku)**:
1. Sign up at Heroku: https://heroku.com
2. Create new app
3. Connect GitHub (backend-node folder)
4. Add PlanetScale database URL
5. Deploy

**Database (PlanetScale)**:
1. Create free database
2. Copy connection string
3. Add to Heroku environment variables

## 💰 Cost: 100% Free
## 🌐 Frontend: Vercel (Fast CDN)
## 🗄️ Backend: Heroku (Free tier)
## 📊 Database: PlanetScale (Free 5GB)
## ⚡ Performance: Excellent
## 🔧 Auto-deploy: On git push
