package com.portfolio.dto;

import com.portfolio.model.SocialLinks;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class PortfolioDto {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    private String email;
    
    private String phone;
    
    @NotBlank(message = "Bio is required")
    private String bio;
    
    private List<String> skills;
    
    private List<ProjectDto> projects;
    
    private SocialLinks socialLinks;
    
    @NotBlank(message = "Theme is required")
    private String theme;
    
    // Constructors
    public PortfolioDto() {}
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    
    public List<ProjectDto> getProjects() { return projects; }
    public void setProjects(List<ProjectDto> projects) { this.projects = projects; }
    
    public SocialLinks getSocialLinks() { return socialLinks; }
    public void setSocialLinks(SocialLinks socialLinks) { this.socialLinks = socialLinks; }
    
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
}
