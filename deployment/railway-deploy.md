# Deploy to Railway (Free Tier)

Railway offers $5/month in free credits, perfect for small applications.

## 🚀 Step-by-Step Railway Deployment

### 1. Prepare Railway Configuration

Create `railway.json` in the root directory:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "dockerfiles"
  },
  "deploy": {
    "restartPolicyType": "always"
  }
}
```

### 2. Create Railway-specific Docker Compose

Create `railway-docker-compose.yml`:

```yaml
services:
  backend:
    build:
      context: ./backend-node
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
      PORT: $PORT
      DATABASE_URL: $DATABASE_URL
      FRONTEND_URL: $FRONTEND_URL
    ports:
      - "$PORT:$PORT"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.railway
    ports:
      - "80:80"
```

### 3. Create Railway-specific Frontend Dockerfile

Create `frontend/Dockerfile.railway`:

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/portfolio-builder /usr/share/nginx/html
COPY nginx.railway.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4. Railway Nginx Configuration

Create `frontend/nginx.railway.conf`:

```nginx
server {
    listen 80;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass $BACKEND_URL;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5. Deployment Steps

1. **Sign up at Railway**: https://railway.app
2. **Connect GitHub**: Link your repository
3. **Create New Project**: Import from GitHub
4. **Add PostgreSQL**: Railway provides free PostgreSQL
5. **Configure Environment Variables**:
   ```
   NODE_ENV=production
   DATABASE_URL=${DATABASE_URL}
   FRONTEND_URL=https://your-app.railway.app
   ```
6. **Deploy**: Railway auto-deploys on git push

### 6. Database Migration

Update your Sequelize config to use PostgreSQL:

```javascript
// In backend-node/models/database.js
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
            require: true,
            rejectUnauthorized: false
        } : false
    }
});
```

## 💰 Cost: Free ($5/month credits)
## 🌐 Custom Domain: Included
## 📊 Database: PostgreSQL included
## 🔧 Auto-deploy: On git push
