# Deployment Guide

## Prerequisites

### Local Deployment
- Node.js 18+ 
- MySQL 8.0
- npm or yarn

### Docker Deployment
- Docker 
- Docker Compose

### Cloud Deployment
- AWS/Azure/GCP account
- kubectl (for Kubernetes)
- Terraform (optional, for infrastructure)

## Deployment Options

### 1. Docker Compose Deployment (Recommended)

This is the easiest way to deploy the entire application with all dependencies.

```bash
# Clone the repository
git clone <your-repo-url>
cd portfolio-builder

# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080
- MySQL: localhost:3306

### 2. Manual Deployment

#### Backend Setup
```bash
cd backend-node
npm install
cp .env.production .env
# Update database credentials in .env
npm start
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run build
# Serve dist/ folder with nginx or Apache
```

#### Database Setup
```bash
mysql -u root -p
CREATE DATABASE portfolio_builder;
USE portfolio_builder;
SOURCE db/schema.sql;
```

### 3. Cloud Deployment

#### AWS Deployment (using ECS)
```bash
# Build and push images to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push backend
docker build -t portfolio-backend ./backend-node
docker tag portfolio-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/portfolio-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/portfolio-backend:latest

# Tag and push frontend
docker build -t portfolio-frontend ./frontend
docker tag portfolio-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/portfolio-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/portfolio-frontend:latest
```

#### Heroku Deployment
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create apps
heroku create portfolio-backend-app
heroku create portfolio-frontend-app

# Add MySQL addon
heroku addons:create cleardb:ignite -a portfolio-backend-app

# Deploy backend
cd backend-node
git init
heroku git:remote -a portfolio-backend-app
git add .
git commit -m "Deploy backend"
git push heroku main

# Deploy frontend
cd ../frontend
# Update API URL in environment files
git init
heroku git:remote -a portfolio-frontend-app
git add .
git commit -m "Deploy frontend"
git push heroku main
```

### 4. Kubernetes Deployment

#### Prerequisites
```bash
# Install kubectl
kubectl version

# Create namespace
kubectl create namespace portfolio-builder
```

#### Deploy with Kubernetes
```bash
# Apply configurations
kubectl apply -f k8s/ -n portfolio-builder

# Check deployments
kubectl get pods -n portfolio-builder
kubectl get services -n portfolio-builder

# Access application
kubectl port-forward service/frontend-service 4200:80 -n portfolio-builder
```

## Environment Configuration

### Production Environment Variables

#### Backend (.env)
```
NODE_ENV=production
PORT=8080
DB_HOST=your-database-host
DB_PORT=3306
DB_NAME=portfolio_builder
DB_USER=your-db-user
DB_PASSWORD=your-db-password
FRONTEND_URL=https://your-frontend-domain.com
```

#### Frontend (environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain.com/api'
};
```

## Security Considerations

1. **Environment Variables**: Never commit .env files with real credentials
2. **HTTPS**: Always use HTTPS in production
3. **Database**: Use strong passwords and restrict access
4. **CORS**: Configure proper CORS settings
5. **Rate Limiting**: Implement rate limiting for APIs
6. **Input Validation**: Validate all user inputs
7. **File Upload**: Secure file upload handling

## Monitoring and Logging

### Health Checks
- Backend: `GET /api/portfolio/list`
- Frontend: `GET /`
- Database: MySQL connection test

### Logging
- Application logs: `docker-compose logs`
- Error tracking: Configure with Sentry or similar
- Performance: Use APM tools like New Relic

## Backup and Recovery

### Database Backup
```bash
# Create backup
docker exec portfolio_mysql mysqldump -u portfolio_user -p portfolio_builder > backup.sql

# Restore backup
docker exec -i portfolio_mysql mysql -u portfolio_user -p portfolio_builder < backup.sql
```

### Generated Files Backup
```bash
# Backup generated portfolio files
tar -czf portfolio-files-backup.tar.gz backend-node/generated/
```

## Scaling

### Horizontal Scaling
- Use load balancer (nginx, AWS ALB)
- Scale backend instances
- Use Redis for session storage
- CDN for static assets

### Database Scaling
- Read replicas for MySQL
- Connection pooling
- Database indexing optimization

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in docker-compose.yml
2. **Database connection**: Check credentials and network
3. **Build failures**: Clear node_modules and rebuild
4. **Permission errors**: Check file permissions
5. **Memory issues**: Increase Docker memory limits

### Debug Commands
```bash
# Check service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Access containers
docker-compose exec backend sh
docker-compose exec mysql mysql -u portfolio_user -p

# Check network connectivity
docker-compose exec backend ping mysql
```

## Performance Optimization

1. **Frontend**:
   - Enable gzip compression
   - Optimize images
   - Use lazy loading
   - Minify assets

2. **Backend**:
   - Database query optimization
   - Caching with Redis
   - Compression middleware
   - Connection pooling

3. **Database**:
   - Proper indexing
   - Query optimization
   - Regular maintenance

## Support

For deployment issues or questions:
1. Check the logs for error messages
2. Verify environment variables
3. Test database connectivity
4. Check network configuration
5. Review security settings
