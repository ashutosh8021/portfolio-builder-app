import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <nav class="navbar">
        <div class="container">
          <h1>Portfolio Builder</h1>
          <div class="nav-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Create</a>
            <a routerLink="/preview" routerLinkActive="active">Preview</a>
          </div>
        </div>
      </nav>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .navbar {
      background-color: #343a40;
      color: white;
      padding: 1rem 0;
      margin-bottom: 2rem;
    }
    
    .navbar .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .nav-links a {
      color: white;
      text-decoration: none;
      margin-left: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    
    .nav-links a:hover,
    .nav-links a.active {
      background-color: #495057;
    }
  `]
})
export class AppComponent {
  title = 'Portfolio Builder';
}
