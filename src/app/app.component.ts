import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, SidebarComponent],
  template: `
    <div class="wrapper">
      <app-sidebar *ngIf="isAuthenticated"></app-sidebar>
      <div class="main-panel" [class.no-sidebar]="!isAuthenticated">
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .main-panel {
      flex: 1;
      margin-right: 0;
      background: #f8f9fa;
      min-height: 100vh;
      transition: margin-right 0.3s ease;
    }

    .content {
      padding: 0;
    }

    .main-panel.no-sidebar {
      margin-right: 0 !important;
    }

    // Ajustar margen cuando el sidebar está abierto
    :host-context(.sidebar-open) .main-panel {
      margin-right: 280px;
    }

    @media (max-width: 991px) {
      .main-panel {
        margin-right: 0;
      }

      :host-context(.sidebar-open) .main-panel {
        margin-right: 0;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Sistema Hospitalario';
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    try {
      this.isAuthenticated = this.authService.isAuthenticated();
      this.authService.currentUser$.subscribe(() => {
        this.isAuthenticated = this.authService.isAuthenticated();
      });
    } catch (error) {
      console.error('Error en AppComponent ngOnInit:', error);
      this.isAuthenticated = false;
    }
  }
}
