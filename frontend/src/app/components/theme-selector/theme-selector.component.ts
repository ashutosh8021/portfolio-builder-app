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
      name: 'Modern',
      description: 'Clean and minimalist design with bold typography',
      preview: 'assets/themes/modern-preview.jpg',
      colors: ['#2c3e50', '#3498db', '#ecf0f1']
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Vibrant and artistic with gradient backgrounds',
      preview: 'assets/themes/creative-preview.jpg',
      colors: ['#8e44ad', '#e74c3c', '#f39c12']
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Corporate and elegant design for business profiles',
      preview: 'assets/themes/professional-preview.jpg',
      colors: ['#2c3e50', '#34495e', '#95a5a6']
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Ultra-clean with lots of white space',
      preview: 'assets/themes/minimal-preview.jpg',
      colors: ['#000000', '#ffffff', '#cccccc']
    }
  ];

  selectTheme(themeId: string) {
    this.selectedTheme = themeId;
    this.themeSelected.emit(themeId);
  }
}
