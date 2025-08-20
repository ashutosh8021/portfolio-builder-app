package com.portfolio.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class SocialLinks {
    
    private String github;
    private String linkedin;
    private String twitter;
    private String website;
    
    // Constructors
    public SocialLinks() {}
    
    // Getters and Setters
    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }
    
    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }
    
    public String getTwitter() { return twitter; }
    public void setTwitter(String twitter) { this.twitter = twitter; }
    
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}
