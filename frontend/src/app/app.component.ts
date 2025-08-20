import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <nav class="navbar">
        <div class="container">
          <div class="brand">
            <h1>🎨 Portfolio Builder</h1>
            <span class="tagline">Create stunning portfolios in minutes</span>
          </div>
          <div class="nav-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="icon">✏️</i> Create
            </a>
            <a routerLink="/preview" routerLinkActive="active">
              <i class="icon">👀</i> Preview
            </a>
          </div>
        </div>
      </nav>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .navbar {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      padding: 1rem 0;
      margin-bottom: 2rem;
    }
    
    .navbar .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand h1 {
      color: white;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .tagline {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-weight: 400;
      display: block;
      margin-top: 4px;
    }
    
    .nav-links {
      display: flex;
      gap: 12px;
    }

    .nav-links a {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 25px;
      transition: all 0.3s ease;
      font-weight: 500;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-links a .icon {
      font-size: 16px;
    }
    
    .nav-links a:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .nav-links a.active {
      background: rgba(255, 255, 255, 0.9);
      color: #667eea;
      font-weight: 600;
    }

    .main-content {
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class AppComponent {
  title = 'Portfolio Builder';
}
