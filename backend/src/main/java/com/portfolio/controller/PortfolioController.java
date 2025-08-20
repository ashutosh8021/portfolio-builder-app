package com.portfolio.controller;

import com.portfolio.dto.PortfolioDto;
import com.portfolio.model.Portfolio;
import com.portfolio.service.PortfolioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "http://localhost:4200")
public class PortfolioController {
    
    @Autowired
    private PortfolioService portfolioService;
    
    @PostMapping("/save")
    public ResponseEntity<Portfolio> savePortfolio(@Valid @RequestBody PortfolioDto portfolioDto) {
        try {
            Portfolio savedPortfolio = portfolioService.savePortfolio(portfolioDto);
            return ResponseEntity.ok(savedPortfolio);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/generate")
    public ResponseEntity<ByteArrayResource> generatePortfolio(@Valid @RequestBody PortfolioDto portfolioDto) {
        try {
            byte[] zipData = portfolioService.generatePortfolioZip(portfolioDto);
            
            ByteArrayResource resource = new ByteArrayResource(zipData);
            
            String filename = portfolioDto.getName().replaceAll("\\s+", "_") + "_portfolio.zip";
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(zipData.length)
                    .body(resource);
                    
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/list")
    public ResponseEntity<List<Portfolio>> getAllPortfolios() {
        try {
            List<Portfolio> portfolios = portfolioService.getAllPortfolios();
            return ResponseEntity.ok(portfolios);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Portfolio> getPortfolioById(@PathVariable Long id) {
        try {
            Portfolio portfolio = portfolioService.getPortfolioById(id);
            if (portfolio != null) {
                return ResponseEntity.ok(portfolio);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable Long id) {
        try {
            portfolioService.deletePortfolio(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
