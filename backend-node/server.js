const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const handlebars = require('handlebars');
require('dotenv').config();

// Import database models
const { sequelize, Portfolio, Project } = require('./models');

const app = express();
const PORT = process.env.PORT || 8080;

// In-memory storage for when database is not available
let memoryPortfolios = [];
let portfolioIdCounter = 1;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection and sync
async function initializeDatabase() {
    if (!sequelize) {
        console.log('No database configuration found. Running in memory mode...');
        return;
    }
    
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        
        // Sync database models (creates tables if they don't exist)
        await sequelize.sync({ alter: true });
        console.log('Database models synchronized.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        console.log('Running in memory mode...');
    }
}

// Template for portfolio HTML
const portfolioTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{name}} - Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="header">
        {{#if profilePhoto}}
        <div class="profile-photo">
            <img src="{{profilePhoto}}" alt="{{name}}" class="profile-img">
        </div>
        {{/if}}
        <h1 class="name">{{name}}</h1>
        <p class="title">{{title}}</p>
        <p class="bio">{{bio}}</p>
        
        <div class="contact-info">
            <span>{{email}}</span>
            {{#if phone}}<span>{{phone}}</span>{{/if}}
        </div>
        
        {{#if socialLinks}}
        <div class="social-links">
            {{#if socialLinks.github}}<a href="{{socialLinks.github}}" target="_blank" class="social-link">GitHub</a>{{/if}}
            {{#if socialLinks.linkedin}}<a href="{{socialLinks.linkedin}}" target="_blank" class="social-link">LinkedIn</a>{{/if}}
            {{#if socialLinks.twitter}}<a href="{{socialLinks.twitter}}" target="_blank" class="social-link">Twitter</a>{{/if}}
            {{#if socialLinks.website}}<a href="{{socialLinks.website}}" target="_blank" class="social-link">Website</a>{{/if}}
        </div>
        {{/if}}
    </header>

    {{#if skills}}
    <section class="section">
        <h2>Skills</h2>
        <div class="skills">
            {{#each skills}}
            <span class="skill">{{this}}</span>
            {{/each}}
        </div>
    </section>
    {{/if}}

    {{#if projects}}
    <section class="section">
        <h2>Projects</h2>
        <div class="projects">
            {{#each projects}}
            <div class="project">
                {{#if image}}
                <div class="project-image">
                    <img src="{{image}}" alt="{{name}} screenshot" class="project-img">
                </div>
                {{/if}}
                <h3>{{name}}</h3>
                <p>{{description}}</p>
                {{#if technologies}}<p><strong>Technologies:</strong> {{technologies}}</p>{{/if}}
                <div class="project-links">
                    {{#if url}}<a href="{{url}}" target="_blank">View Live</a>{{/if}}
                    {{#if github}}<a href="{{github}}" target="_blank">View Code</a>{{/if}}
                </div>
            </div>
            {{/each}}
        </div>
    </section>
    {{/if}}
</body>
</html>
`;

// CSS themes
const themes = {
    modern: `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4rem 2rem; text-align: center; }
        .profile-photo { margin-bottom: 2rem; }
        .profile-img { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,0.2); }
        .name { font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem; }
        .title { font-size: 1.5rem; margin-bottom: 1.5rem; opacity: 0.9; }
        .bio { font-size: 1.1rem; max-width: 600px; margin: 0 auto 2rem; line-height: 1.6; }
        .contact-info { margin-bottom: 2rem; }
        .contact-info span { margin: 0 1rem; }
        .section { padding: 3rem 2rem; max-width: 1000px; margin: 0 auto; }
        .section h2 { text-align: center; margin-bottom: 2rem; font-size: 2.5rem; color: #333; }
        .skills { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; }
        .skill { background: #007bff; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; }
        .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .project { border: 1px solid #dee2e6; border-radius: 8px; padding: 1.5rem; transition: transform 0.3s, box-shadow 0.3s; }
        .project:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .project-image { margin-bottom: 1rem; }
        .project-img { width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; }
        .social-links { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
        .social-link { color: white; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid rgba(255,255,255,0.3); border-radius: 4px; transition: background-color 0.3s; }
        .social-link:hover { background-color: rgba(255,255,255,0.2); }
        .project-links { display: flex; gap: 1rem; margin-top: 1rem; }
        .project-links a { color: #007bff; text-decoration: none; font-weight: 500; }
        .project-links a:hover { text-decoration: underline; }
    `,
    creative: `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #8e44ad 0%, #e74c3c 100%); color: white; padding: 4rem 2rem; text-align: center; }
        .profile-photo { margin-bottom: 2rem; }
        .profile-img { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,0.2); }
        .name { font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem; }
        .title { font-size: 1.5rem; margin-bottom: 1.5rem; opacity: 0.9; }
        .bio { font-size: 1.1rem; max-width: 600px; margin: 0 auto 2rem; line-height: 1.6; }
        .contact-info { margin-bottom: 2rem; }
        .contact-info span { margin: 0 1rem; }
        .section { padding: 3rem 2rem; max-width: 1000px; margin: 0 auto; }
        .section h2 { text-align: center; margin-bottom: 2rem; font-size: 2.5rem; color: #333; }
        .skills { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; }
        .skill { background: #e74c3c; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; }
        .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .project { border: 1px solid #dee2e6; border-radius: 8px; padding: 1.5rem; transition: transform 0.3s, box-shadow 0.3s; }
        .project:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .project-image { margin-bottom: 1rem; }
        .project-img { width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; }
        .social-links { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
        .social-link { color: white; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid rgba(255,255,255,0.3); border-radius: 4px; transition: background-color 0.3s; }
        .social-link:hover { background-color: rgba(255,255,255,0.2); }
        .project-links { display: flex; gap: 1rem; margin-top: 1rem; }
        .project-links a { color: #e74c3c; text-decoration: none; font-weight: 500; }
        .project-links a:hover { text-decoration: underline; }
    `,
    professional: `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: white; padding: 4rem 2rem; text-align: center; }
        .profile-photo { margin-bottom: 2rem; }
        .profile-img { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,0.2); }
        .name { font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem; }
        .title { font-size: 1.5rem; margin-bottom: 1.5rem; opacity: 0.9; }
        .bio { font-size: 1.1rem; max-width: 600px; margin: 0 auto 2rem; line-height: 1.6; }
        .contact-info { margin-bottom: 2rem; }
        .contact-info span { margin: 0 1rem; }
        .section { padding: 3rem 2rem; max-width: 1000px; margin: 0 auto; }
        .section h2 { text-align: center; margin-bottom: 2rem; font-size: 2.5rem; color: #333; }
        .skills { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; }
        .skill { background: #34495e; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; }
        .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .project { border: 1px solid #dee2e6; border-radius: 8px; padding: 1.5rem; transition: transform 0.3s, box-shadow 0.3s; }
        .project:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .project-image { margin-bottom: 1rem; }
        .project-img { width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; }
        .social-links { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
        .social-link { color: white; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid rgba(255,255,255,0.3); border-radius: 4px; transition: background-color 0.3s; }
        .social-link:hover { background-color: rgba(255,255,255,0.2); }
        .project-links { display: flex; gap: 1rem; margin-top: 1rem; }
        .project-links a { color: #34495e; text-decoration: none; font-weight: 500; }
        .project-links a:hover { text-decoration: underline; }
    `,
    minimal: `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #000000 0%, #434343 100%); color: white; padding: 4rem 2rem; text-align: center; }
        .profile-photo { margin-bottom: 2rem; }
        .profile-img { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,0.2); }
        .name { font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem; }
        .title { font-size: 1.5rem; margin-bottom: 1.5rem; opacity: 0.9; }
        .bio { font-size: 1.1rem; max-width: 600px; margin: 0 auto 2rem; line-height: 1.6; }
        .contact-info { margin-bottom: 2rem; }
        .contact-info span { margin: 0 1rem; }
        .section { padding: 3rem 2rem; max-width: 1000px; margin: 0 auto; }
        .section h2 { text-align: center; margin-bottom: 2rem; font-size: 2.5rem; color: #333; }
        .skills { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; }
        .skill { background: #000; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; }
        .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .project { border: 1px solid #dee2e6; border-radius: 8px; padding: 1.5rem; transition: transform 0.3s, box-shadow 0.3s; }
        .project:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .project-image { margin-bottom: 1rem; }
        .project-img { width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; }
        .social-links { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
        .social-link { color: white; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid rgba(255,255,255,0.3); border-radius: 4px; transition: background-color 0.3s; }
        .social-link:hover { background-color: rgba(255,255,255,0.2); }
        .project-links { display: flex; gap: 1rem; margin-top: 1rem; }
        .project-links a { color: #000; text-decoration: none; font-weight: 500; }
        .project-links a:hover { text-decoration: underline; }
    `
};

// API Routes
app.post('/api/portfolio/save', async (req, res) => {
    try {
        const { projects, projectPhotos, ...portfolioData } = req.body;
        
        if (Portfolio && Project) {
            // Database mode
            const portfolio = await Portfolio.create(portfolioData);
            
            // Create associated projects if they exist
            if (projects && projects.length > 0) {
                const projectsWithPortfolioId = projects.map((project, index) => ({
                    ...project,
                    portfolioId: portfolio.id,
                    image: projectPhotos && projectPhotos[index] ? projectPhotos[index] : null
                }));
                await Project.bulkCreate(projectsWithPortfolioId);
            }
            
            // Fetch the complete portfolio with projects
            const savedPortfolio = await Portfolio.findByPk(portfolio.id, {
                include: [{
                    model: Project,
                    as: 'projects'
                }]
            });
            
            res.json(savedPortfolio);
        } else {
            // In-memory mode - add photos to projects
            const projectsWithPhotos = projects ? projects.map((project, index) => ({
                ...project,
                image: projectPhotos && projectPhotos[index] ? projectPhotos[index] : null
            })) : [];
            
            const portfolio = {
                id: portfolioIdCounter++,
                ...portfolioData,
                projects: projectsWithPhotos,
                created_at: new Date(),
                updated_at: new Date()
            };
            
            memoryPortfolios.push(portfolio);
            res.json(portfolio);
        }
    } catch (error) {
        console.error('Error saving portfolio:', error);
        res.status(500).json({ error: 'Failed to save portfolio' });
    }
});

app.post('/api/portfolio/generate', async (req, res) => {
    try {
        const portfolioData = req.body;
        const template = handlebars.compile(portfolioTemplate);
        const html = template(portfolioData);
        const css = themes[portfolioData.theme] || themes.modern;
        
        // Create temporary directory
        const tempDir = path.join(__dirname, 'temp', Date.now().toString());
        await fs.ensureDir(tempDir);
        
        // Write files
        await fs.writeFile(path.join(tempDir, 'index.html'), html);
        await fs.writeFile(path.join(tempDir, 'style.css'), css);
        
        // Create ZIP
        const zipName = `${portfolioData.name.replace(/\s+/g, '_')}_portfolio.zip`;
        const zipPath = path.join(__dirname, 'temp', zipName);
        
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });
        
        output.on('close', async () => {
            // Send ZIP file
            res.download(zipPath, zipName, async (err) => {
                if (!err) {
                    // Cleanup
                    await fs.remove(tempDir);
                    await fs.remove(zipPath);
                }
            });
        });
        
        archive.on('error', (err) => {
            throw err;
        });
        
        archive.pipe(output);
        archive.directory(tempDir, false);
        await archive.finalize();
        
    } catch (error) {
        console.error('Error generating portfolio:', error);
        res.status(500).json({ error: 'Failed to generate portfolio' });
    }
});

app.get('/api/portfolio/list', async (req, res) => {
    try {
        if (Portfolio && Project) {
            // Database mode
            const portfolios = await Portfolio.findAll({
                include: [{
                    model: Project,
                    as: 'projects'
                }],
                order: [['created_at', 'DESC']]
            });
            res.json(portfolios);
        } else {
            // In-memory mode
            const portfolios = [...memoryPortfolios].reverse(); // Most recent first
            res.json(portfolios);
        }
    } catch (error) {
        console.error('Error fetching portfolios:', error);
        res.status(500).json({ error: 'Failed to fetch portfolios' });
    }
});

app.get('/api/portfolio/:id', async (req, res) => {
    try {
        if (Portfolio && Project) {
            // Database mode
            const portfolio = await Portfolio.findByPk(req.params.id, {
                include: [{
                    model: Project,
                    as: 'projects'
                }]
            });
            
            if (portfolio) {
                res.json(portfolio);
            } else {
                res.status(404).json({ error: 'Portfolio not found' });
            }
        } else {
            // In-memory mode
            const portfolio = memoryPortfolios.find(p => p.id == req.params.id);
            if (portfolio) {
                res.json(portfolio);
            } else {
                res.status(404).json({ error: 'Portfolio not found' });
            }
        }
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
});

app.delete('/api/portfolio/:id', async (req, res) => {
    try {
        if (Portfolio) {
            // Database mode
            const portfolio = await Portfolio.findByPk(req.params.id);
            
            if (portfolio) {
                await portfolio.destroy();
                res.json({ message: 'Portfolio deleted successfully' });
            } else {
                res.status(404).json({ error: 'Portfolio not found' });
            }
        } else {
            // In-memory mode
            const portfolioIndex = memoryPortfolios.findIndex(p => p.id == req.params.id);
            if (portfolioIndex !== -1) {
                memoryPortfolios.splice(portfolioIndex, 1);
                res.json({ message: 'Portfolio deleted successfully' });
            } else {
                res.status(404).json({ error: 'Portfolio not found' });
            }
        }
    } catch (error) {
        console.error('Error deleting portfolio:', error);
        res.status(500).json({ error: 'Failed to delete portfolio' });
    }
});

// Start server
async function startServer() {
    // Initialize database first
    await initializeDatabase();
    
    app.listen(PORT, () => {
        console.log(`Portfolio Builder Backend running on http://localhost:${PORT}`);
        console.log('Database:', process.env.DB_NAME || 'portfolio_builder');
        console.log('Available endpoints:');
        console.log('  POST /api/portfolio/save - Save portfolio');
        console.log('  POST /api/portfolio/generate - Generate portfolio ZIP');
        console.log('  GET /api/portfolio/list - List all portfolios');
        console.log('  GET /api/portfolio/:id - Get specific portfolio');
        console.log('  DELETE /api/portfolio/:id - Delete portfolio');
    });
}

startServer().catch(console.error);

module.exports = app;
