package com.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

public class ProjectDto {
    
    @NotBlank(message = "Project name is required")
    private String name;
    
    @NotBlank(message = "Project description is required")
    private String description;
    
    private String technologies;
    private String url;
    private String github;
    
    // Constructors
    public ProjectDto() {}
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getTechnologies() { return technologies; }
    public void setTechnologies(String technologies) { this.technologies = technologies; }
    
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    
    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }
}
