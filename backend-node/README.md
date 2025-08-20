# MySQL Database Setup for Portfolio Builder

## Prerequisites

1. **Install MySQL 8.0+**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use Docker: `docker run --name mysql-portfolio -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:8.0`

## Setup Instructions

### Option 1: Manual MySQL Setup

1. **Start MySQL service**
   ```bash
   # Windows (if installed as service)
   net start mysql
   
   # Or start MySQL manually
   mysqld --console
   ```

2. **Create database and tables**
   ```bash
   mysql -u root -p < setup-database.sql
   ```

3. **Update environment variables**
   - Copy `.env.example` to `.env` if needed
   - Update database credentials in `.env`:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=portfolio_builder
   DB_USER=root
   DB_PASSWORD=your_password
   ```

### Option 2: Docker Setup (Recommended)

1. **Run MySQL in Docker**
   ```bash
   docker run --name mysql-portfolio \
     -e MYSQL_ROOT_PASSWORD=password \
     -e MYSQL_DATABASE=portfolio_builder \
     -p 3306:3306 \
     -d mysql:8.0
   ```

2. **Wait for MySQL to start (30 seconds)**
   ```bash
   docker logs mysql-portfolio
   ```

3. **Run database setup**
   ```bash
   docker exec -i mysql-portfolio mysql -uroot -ppassword < setup-database.sql
   ```

### Option 3: No MySQL (Fallback)

If MySQL is not available, the application will automatically fall back to in-memory storage:
- Data will not persist between server restarts
- All functionality will work except data persistence

## Environment Configuration

Create or update `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=portfolio_builder
DB_USER=root
DB_PASSWORD=password

# Server Configuration
PORT=8080
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:4200
```

## Testing Database Connection

1. **Start the backend server**
   ```bash
   npm start
   ```

2. **Check console output**
   - ✅ Success: "Database connection established successfully."
   - ❌ Fallback: "Running in memory mode..."

3. **Test with API**
   ```bash
   curl http://localhost:8080/api/portfolio/list
   ```

## Database Schema

### Tables Created:
- **portfolios** - Main portfolio information
- **projects** - Project details linked to portfolios

### Sample Data:
- One sample portfolio for "John Doe"
- Two sample projects: E-commerce Platform and Task Management App

## Troubleshooting

### Connection Issues:
1. Verify MySQL is running: `mysql -u root -p`
2. Check port 3306 is not blocked
3. Verify credentials in `.env` file
4. Check MySQL logs for errors

### Permission Issues:
```sql
-- Grant permissions if needed
GRANT ALL PRIVILEGES ON portfolio_builder.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Reset Database:
```sql
DROP DATABASE portfolio_builder;
-- Then run setup-database.sql again
```
