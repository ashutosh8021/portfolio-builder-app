-- Portfolio Builder Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS portfolio_builder;
USE portfolio_builder;

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    bio TEXT NOT NULL,
    theme VARCHAR(50) NOT NULL,
    github VARCHAR(255),
    linkedin VARCHAR(255),
    twitter VARCHAR(255),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create portfolio_skills table
CREATE TABLE IF NOT EXISTS portfolio_skills (
    portfolio_id BIGINT NOT NULL,
    skill VARCHAR(255) NOT NULL,
    PRIMARY KEY (portfolio_id, skill),
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    portfolio_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    technologies VARCHAR(500),
    url VARCHAR(255),
    github VARCHAR(255),
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO portfolios (name, title, email, bio, theme, github, linkedin) VALUES
('John Doe', 'Full Stack Developer', 'john.doe@example.com', 
 'Passionate full-stack developer with 5+ years of experience building web applications using modern technologies.',
 'modern', 'https://github.com/johndoe', 'https://linkedin.com/in/johndoe');

INSERT INTO portfolio_skills (portfolio_id, skill) VALUES
(1, 'JavaScript'),
(1, 'React'),
(1, 'Node.js'),
(1, 'Python'),
(1, 'MySQL'),
(1, 'AWS');

INSERT INTO projects (portfolio_id, name, description, technologies, url, github) VALUES
(1, 'E-commerce Platform', 
   'A full-featured e-commerce platform with user authentication, payment processing, and admin dashboard.',
   'React, Node.js, Express, MongoDB, Stripe',
   'https://ecommerce-demo.com',
   'https://github.com/johndoe/ecommerce-platform'),
(1, 'Task Management App',
   'A collaborative task management application with real-time updates and team collaboration features.',
   'Vue.js, Python, Django, PostgreSQL, WebSocket',
   'https://taskmanager-demo.com',
   'https://github.com/johndoe/task-manager');

-- Create indexes for better performance
CREATE INDEX idx_portfolios_email ON portfolios(email);
CREATE INDEX idx_portfolios_theme ON portfolios(theme);
CREATE INDEX idx_projects_portfolio_id ON projects(portfolio_id);
