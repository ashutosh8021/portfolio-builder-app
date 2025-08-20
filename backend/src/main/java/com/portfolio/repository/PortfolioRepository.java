package com.portfolio.repository;

import com.portfolio.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    
    List<Portfolio> findByEmailContainingIgnoreCase(String email);
    
    List<Portfolio> findByTheme(String theme);
    
    Optional<Portfolio> findByEmail(String email);
}
