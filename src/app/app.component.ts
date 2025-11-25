import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, SidebarComponent],
  template: `
    <div class="wrapper">
      <app-sidebar></app-sidebar>
      <div class="main-panel">
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
export class AppComponent {
  title = 'Sistema Hospitalario';
}
