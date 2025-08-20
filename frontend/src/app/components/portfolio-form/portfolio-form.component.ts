import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-portfolio-form',
  templateUrl: './portfolio-form.component.html',
  styleUrls: ['./portfolio-form.component.css']
})
export class PortfolioFormComponent {
  portfolioForm: FormGroup;
  selectedTheme = 'modern';
  profilePhotoPreview: string | null = null;
  profilePhotoFile: File | null = null;
  projectPhotoPreviews: { [key: number]: string } = {};
  projectPhotoFiles: { [key: number]: File } = {};

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private router: Router
  ) {
    this.portfolioForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      bio: ['', Validators.required],
      skills: this.fb.array([]),
      projects: this.fb.array([]),
      socialLinks: this.fb.group({
        github: [''],
        linkedin: [''],
        twitter: [''],
        website: ['']
      })
    });
  }

  get skills() {
    return this.portfolioForm.get('skills') as FormArray;
  }

  get projects() {
    return this.portfolioForm.get('projects') as FormArray;
  }

  addSkill() {
    this.skills.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  addProject() {
    this.projects.push(this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      technologies: [''],
      url: [''],
      github: ['']
    }));
  }

  removeProject(index: number) {
    this.projects.removeAt(index);
  }

  onThemeSelected(theme: string) {
    this.selectedTheme = theme;
  }

  // Photo handling methods
  onProfilePhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.isValidImageFile(file)) {
      this.profilePhotoFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePhotoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfilePhoto() {
    this.profilePhotoPreview = null;
    this.profilePhotoFile = null;
  }

  onProjectPhotoSelected(event: any, projectIndex: number) {
    const file = event.target.files[0];
    if (file && this.isValidImageFile(file)) {
      this.projectPhotoFiles[projectIndex] = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.projectPhotoPreviews[projectIndex] = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeProjectPhoto(projectIndex: number) {
    delete this.projectPhotoPreviews[projectIndex];
    delete this.projectPhotoFiles[projectIndex];
  }

  getProjectPhotoPreview(projectIndex: number): string | null {
    return this.projectPhotoPreviews[projectIndex] || null;
  }

  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG, GIF, WebP)');
      return false;
    }
    
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return false;
    }
    
    return true;
  }

  onSubmit() {
    if (this.portfolioForm.valid) {
      const portfolioData = {
        ...this.portfolioForm.value,
        theme: this.selectedTheme,
        profilePhoto: this.profilePhotoPreview,
        projectPhotos: this.projectPhotoPreviews
      };
      
      this.portfolioService.setPortfolioData(portfolioData);
      this.router.navigate(['/preview']);
    }
  }

  generatePreview() {
    const portfolioData = {
      ...this.portfolioForm.value,
      theme: this.selectedTheme,
      profilePhoto: this.profilePhotoPreview,
      projectPhotos: this.projectPhotoPreviews
    };
    
    this.portfolioService.setPortfolioData(portfolioData);
    this.router.navigate(['/preview']);
  }
}
