# Online Portfolio Builder

A full-stack web application that allows users to build personal portfolios using customizable templates. Users can enter their details, select a design theme, and generate a live preview or downloadable website.

## 🚀 Features

- **Form-based UI** - Easy-to-use Angular interface for portfolio creation
- **Multiple Themes** - 4 beautiful, customizable HTML/CSS themes (Modern, Creative, Professional, Minimal)
- **Live Preview** - Real-time preview of your portfolio
- **Downloadable Sites** - Generate and download complete portfolio as ZIP file
- **Data Persistence** - Save portfolios to MySQL database
- **Responsive Design** - Mobile-friendly themes
- **Social Integration** - Add GitHub, LinkedIn, Twitter, and personal website links

## 🏗️ Architecture

- **Frontend**: Angular 17+ with TypeScript
- **Backend**: Spring Boot 3+ with Java 17
- **Database**: MySQL 8.0
- **Template Engine**: Thymeleaf for portfolio generation

## 📁 Project Structure

```
├── frontend/          # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── ...
│   │   └── ...
│   └── package.json
├── backend/           # Spring Boot application
│   ├── src/main/java/com/portfolio/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── model/
│   │   ├── repository/
│   │   └── dto/
│   └── pom.xml
├── db/               # Database setup
│   ├── schema.sql
│   └── README.md
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 20.19+ and npm
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### 1. Database Setup
```bash
# Start MySQL and create database
mysql -u root -p < db/schema.sql
```

### 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The backend will start on http://localhost:8080

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend will start on http://localhost:4200

## 🎨 Available Themes

1. **Modern** - Clean and minimalist with bold typography
2. **Creative** - Vibrant and artistic with gradient backgrounds  
3. **Professional** - Corporate and elegant for business profiles
4. **Minimal** - Ultra-clean with lots of white space

## 📋 Usage

1. **Fill Portfolio Form** - Enter your personal information, skills, projects, and social links
2. **Select Theme** - Choose from 4 available themes
3. **Preview** - See live preview of your portfolio
4. **Download** - Generate and download your portfolio as a ZIP file
5. **Save** - Store your portfolio data in the database

## 🔧 API Endpoints

- `POST /api/portfolio/save` - Save portfolio data
- `POST /api/portfolio/generate` - Generate and download portfolio ZIP
- `GET /api/portfolio/list` - Get all saved portfolios
- `GET /api/portfolio/{id}` - Get specific portfolio
- `DELETE /api/portfolio/{id}` - Delete portfolio

## 🎯 Key Learning Outcomes

- **Dynamic Page Rendering** - Learn how backend templates are compiled with user data
- **Frontend Templating** - Understand Angular component architecture and form handling
- **Full-Stack Integration** - Connect Angular frontend with Spring Boot backend
- **File Generation** - Generate and serve downloadable content
- **Database Design** - Model complex relationships with JPA/Hibernate

## 🚀 Optional Enhancements

- **GitHub Pages Deployment** - One-click deployment to GitHub Pages
- **Netlify Integration** - Deploy directly to Netlify
- **Custom Domain** - Add custom domain support
- **PDF Export** - Generate PDF versions of portfolios
- **Theme Customization** - Allow users to customize colors and fonts

## 🧪 Testing

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
mvn test
```

## 📝 Configuration

### Database Configuration
Update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/portfolio_builder
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### CORS Configuration
The backend is configured to accept requests from `http://localhost:4200`. Update in `application.properties` if needed.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Portfolio Builder** - Empowering developers to showcase their skills and projects with beautiful, professional portfolios.
