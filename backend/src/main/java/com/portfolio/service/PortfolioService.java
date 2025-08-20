package com.portfolio.service;

import com.portfolio.dto.PortfolioDto;
import com.portfolio.model.Portfolio;
import com.portfolio.model.Project;
import com.portfolio.repository.PortfolioRepository;
import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.model.ZipParameters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class PortfolioService {
    
    @Autowired
    private PortfolioRepository portfolioRepository;
    
    @Autowired
    private TemplateEngine templateEngine;
    
    public Portfolio savePortfolio(PortfolioDto portfolioDto) {
        Portfolio portfolio = convertToEntity(portfolioDto);
        return portfolioRepository.save(portfolio);
    }
    
    public byte[] generatePortfolioZip(PortfolioDto portfolioDto) throws Exception {
        // Create temporary directory
        Path tempDir = Files.createTempDirectory("portfolio_");
        
        try {
            // Generate HTML content
            String htmlContent = generateHtmlContent(portfolioDto);
            
            // Write HTML file
            Path htmlFile = tempDir.resolve("index.html");
            Files.write(htmlFile, htmlContent.getBytes());
            
            // Copy CSS files based on theme
            String cssContent = generateCssContent(portfolioDto.getTheme());
            Path cssFile = tempDir.resolve("style.css");
            Files.write(cssFile, cssContent.getBytes());
            
            // Create ZIP file
            Path zipPath = Files.createTempFile("portfolio", ".zip");
            ZipFile zipFile = new ZipFile(zipPath.toFile());
            
            // Add files to ZIP
            zipFile.addFolder(tempDir.toFile());
            
            // Read ZIP file as bytes
            byte[] zipData = Files.readAllBytes(zipPath);
            
            // Cleanup
            Files.deleteIfExists(zipPath);
            deleteDirectory(tempDir);
            
            return zipData;
            
        } catch (Exception e) {
            deleteDirectory(tempDir);
            throw e;
        }
    }
    
    private String generateHtmlContent(PortfolioDto portfolioDto) {
        Context context = new Context();
        context.setVariable("portfolio", portfolioDto);
        
        return templateEngine.process("portfolio-template", context);
    }
    
    private String generateCssContent(String theme) {
        // Return theme-specific CSS
        switch (theme) {
            case "modern":
                return getModernCss();
            case "creative":
                return getCreativeCss();
            case "professional":
                return getProfessionalCss();
            case "minimal":
                return getMinimalCss();
            default:
                return getModernCss();
        }
    }
    
    private String getModernCss() {
        return """
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 4rem 2rem;
                text-align: center;
            }
            
            .name {
                font-size: 3rem;
                font-weight: bold;
                margin-bottom: 0.5rem;
            }
            
            .title {
                font-size: 1.5rem;
                margin-bottom: 1.5rem;
                opacity: 0.9;
            }
            
            .bio {
                font-size: 1.1rem;
                max-width: 600px;
                margin: 0 auto 2rem;
                line-height: 1.6;
            }
            
            .contact-info {
                margin-bottom: 2rem;
            }
            
            .section {
                padding: 3rem 2rem;
                max-width: 1000px;
                margin: 0 auto;
            }
            
            .section h2 {
                text-align: center;
                margin-bottom: 2rem;
                font-size: 2.5rem;
                color: #333;
            }
            
            .skills {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 1rem;
            }
            
            .skill {
                background: #007bff;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.9rem;
            }
            
            .projects {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
            }
            
            .project {
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 1.5rem;
                transition: transform 0.3s, box-shadow 0.3s;
            }
            
            .project:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            
            .social-links {
                display: flex;
                justify-content: center;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .social-link {
                color: white;
                text-decoration: none;
                padding: 0.5rem 1rem;
                border: 1px solid rgba(255,255,255,0.3);
                border-radius: 4px;
                transition: background-color 0.3s;
            }
            
            .social-link:hover {
                background-color: rgba(255,255,255,0.2);
            }
            """;
    }
    
    private String getCreativeCss() {
        return getModernCss().replace(
            "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);",
            "background: linear-gradient(135deg, #8e44ad 0%, #e74c3c 100%);"
        );
    }
    
    private String getProfessionalCss() {
        return getModernCss().replace(
            "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);",
            "background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);"
        );
    }
    
    private String getMinimalCss() {
        return getModernCss().replace(
            "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);",
            "background: linear-gradient(135deg, #000000 0%, #434343 100%);"
        );
    }
    
    public List<Portfolio> getAllPortfolios() {
        return portfolioRepository.findAll();
    }
    
    public Portfolio getPortfolioById(Long id) {
        return portfolioRepository.findById(id).orElse(null);
    }
    
    public void deletePortfolio(Long id) {
        portfolioRepository.deleteById(id);
    }
    
    private Portfolio convertToEntity(PortfolioDto dto) {
        Portfolio portfolio = new Portfolio();
        portfolio.setName(dto.getName());
        portfolio.setTitle(dto.getTitle());
        portfolio.setEmail(dto.getEmail());
        portfolio.setPhone(dto.getPhone());
        portfolio.setBio(dto.getBio());
        portfolio.setSkills(dto.getSkills());
        portfolio.setTheme(dto.getTheme());
        portfolio.setSocialLinks(dto.getSocialLinks());
        
        if (dto.getProjects() != null) {
            List<Project> projects = dto.getProjects().stream()
                    .map(projectDto -> {
                        Project project = new Project();
                        project.setName(projectDto.getName());
                        project.setDescription(projectDto.getDescription());
                        project.setTechnologies(projectDto.getTechnologies());
                        project.setUrl(projectDto.getUrl());
                        project.setGithub(projectDto.getGithub());
                        project.setPortfolio(portfolio);
                        return project;
                    })
                    .toList();
            portfolio.setProjects(projects);
        }
        
        return portfolio;
    }
    
    private void deleteDirectory(Path directory) throws IOException {
        if (Files.exists(directory)) {
            Files.walk(directory)
                    .sorted((a, b) -> b.compareTo(a))
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                        } catch (IOException e) {
                            // Ignore
                        }
                    });
        }
    }
}
