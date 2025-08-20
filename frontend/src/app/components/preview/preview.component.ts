import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  portfolioData: any = null;
  isGenerating = false;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.portfolioData = this.portfolioService.getPortfolioData();
  }

  async downloadPortfolio() {
    if (!this.portfolioData) return;
    
    this.isGenerating = true;
    try {
      await this.portfolioService.downloadPortfolio(this.portfolioData);
    } catch (error) {
      console.error('Error generating portfolio:', error);
    } finally {
      this.isGenerating = false;
    }
  }

  async savePortfolio() {
    if (!this.portfolioData) return;
    
    try {
      await this.portfolioService.savePortfolio(this.portfolioData);
      alert('Portfolio saved successfully!');
    } catch (error) {
      console.error('Error saving portfolio:', error);
      alert('Error saving portfolio. Please try again.');
    }
  }

  getProjectImage(index: number): string | null {
    return this.portfolioData?.projectPhotos?.[index] || null;
  }
}
