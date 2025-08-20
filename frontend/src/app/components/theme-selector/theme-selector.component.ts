import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.css']
})
export class ThemeSelectorComponent {
  @Output() themeSelected = new EventEmitter<string>();
  
  selectedTheme = 'modern';
  
  themes = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean and minimalist design with bold typography perfect for tech professionals',
      headerBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      contentBg: '#ffffff',
      colors: ['#667eea', '#764ba2', '#f8f9fa', '#343a40'],
      tags: ['Clean', 'Professional', 'Modern']
    },
    {
      id: 'creative',
      name: 'Creative Artist',
      description: 'Vibrant and artistic with gradient backgrounds for creative professionals',
      headerBg: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      contentBg: '#fff5f5',
      colors: ['#ff6b6b', '#ee5a24', '#ffeaa7', '#fd79a8'],
      tags: ['Vibrant', 'Artistic', 'Bold']
    },
    {
      id: 'professional',
      name: 'Corporate Elite',
      description: 'Sophisticated and elegant design perfect for business executives',
      headerBg: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
      contentBg: '#f8f9fa',
      colors: ['#2d3436', '#636e72', '#ddd', '#74b9ff'],
      tags: ['Corporate', 'Elegant', 'Executive']
    },
    {
      id: 'minimal',
      name: 'Ultra Minimal',
      description: 'Clean and simple with lots of white space for a distraction-free experience',
      headerBg: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
      contentBg: '#ffffff',
      colors: ['#000000', '#ffffff', '#f1f2f6', '#57606f'],
      tags: ['Simple', 'Clean', 'Minimal']
    }
  ];

  selectTheme(themeId: string) {
    this.selectedTheme = themeId;
    this.themeSelected.emit(themeId);
  }
}
