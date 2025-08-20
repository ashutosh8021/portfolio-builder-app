-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS portfolio_builder;
USE portfolio_builder;

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    bio TEXT NOT NULL,
    skills JSON,
    socialLinks JSON,
    theme VARCHAR(50) NOT NULL DEFAULT 'modern',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    technologies VARCHAR(500),
    url VARCHAR(255),
    github VARCHAR(255),
    portfolioId INT NOT NULL,
    FOREIGN KEY (portfolioId) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO portfolios (name, title, email, bio, skills, socialLinks, theme) VALUES
('John Doe', 'Full Stack Developer', 'john.doe@example.com', 
 'Passionate full-stack developer with 5+ years of experience building web applications using modern technologies.',
 '["JavaScript", "React", "Node.js", "Python", "MySQL", "AWS"]',
 '{"github": "https://github.com/johndoe", "linkedin": "https://linkedin.com/in/johndoe"}',
 'modern')
ON DUPLICATE KEY UPDATE name = name;

-- Get the portfolio ID for projects
SET @portfolio_id = (SELECT id FROM portfolios WHERE email = 'john.doe@example.com' LIMIT 1);

-- Insert sample projects
INSERT INTO projects (portfolioId, name, description, technologies, url, github) VALUES
(@portfolio_id, 'E-commerce Platform', 
 'A full-featured e-commerce platform with user authentication, payment processing, and admin dashboard.',
 'React, Node.js, Express, MongoDB, Stripe',
 'https://ecommerce-demo.com',
 'https://github.com/johndoe/ecommerce-platform'),
(@portfolio_id, 'Task Management App',
 'A collaborative task management application with real-time updates and team collaboration features.',
 'Vue.js, Python, Django, PostgreSQL, WebSocket',
 'https://taskmanager-demo.com',
 'https://github.com/johndoe/task-manager')
ON DUPLICATE KEY UPDATE name = name;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolios_email ON portfolios(email);
CREATE INDEX IF NOT EXISTS idx_portfolios_theme ON portfolios(theme);
CREATE INDEX IF NOT EXISTS idx_projects_portfolio_id ON projects(portfolioId);
