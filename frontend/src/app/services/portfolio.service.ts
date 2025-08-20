import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = environment.apiUrl;
  private portfolioDataSubject = new BehaviorSubject<any>(null);
  
  constructor(private http: HttpClient) {}

  setPortfolioData(data: any) {
    this.portfolioDataSubject.next(data);
  }

  getPortfolioData() {
    return this.portfolioDataSubject.value;
  }

  async savePortfolio(portfolioData: any) {
    try {
      const response = await this.http.post(`${this.apiUrl}/portfolio-save`, portfolioData).toPromise();
      return response;
    } catch (error) {
      console.error('Error saving portfolio:', error);
      throw error;
    }
  }

  async downloadPortfolio(portfolioData: any) {
    try {
      const response = await this.http.post(`${this.apiUrl}/portfolio-generate`, { portfolioId: portfolioData.id }, {
        responseType: 'blob'
      }).toPromise();
      
      // Create download link
      const blob = new Blob([response as Blob], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${portfolioData.name.replace(/\s+/g, '_')}_portfolio.zip`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      return response;
    } catch (error) {
      console.error('Error generating portfolio:', error);
      throw error;
    }
  }

  async getPortfolios() {
    try {
      const response = await this.http.get(`${this.apiUrl}/portfolio-list`).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      throw error;
    }
  }
}
