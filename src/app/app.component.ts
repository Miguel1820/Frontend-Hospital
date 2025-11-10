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
      <div class="sidebar" data-color="red">
        <app-sidebar></app-sidebar>
      </div>
      <div class="main-panel">

        <button 
          class="hamburger-btn d-lg-none"
          (click)="toggleSidebar()">
          <i class="fas fa-bars"></i>
        </button>

        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ---------- WRAPPER GENERAL ---------- */
    .wrapper {
      display: flex;
      min-height: 100vh;
    }

    /* ---------- SIDEBAR ---------- */
    .sidebar {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1000;
      width: 280px;
      background: linear-gradient(180deg, #0f9b0f 0%, #000000 100%);
      box-shadow: 0 0 25px rgba(0, 0, 0, 0.3);
      color: #fff;
      display: flex;
      flex-direction: column;
      font-family: 'Poppins', sans-serif;
      transition: transform 0.3s ease;
    }


    /*------ Responsive: Ocultar sidebar en móvil ------*/
    @media (max-width: 991px) {
      .sidebar {
        transform: translateX(-100%);
      }
      .sidebar.show {
        transform: translateX(0);
      }
    }

    /* ---------- MAIN PANEL ---------- */
    .main-panel {
      margin-left: 280px;
      flex: 1;
      min-height: 100vh;
      background: #1973cdff;
      transition: margin-left 0.3s ease;
    }

    /* ---------- CONTENT AREA ---------- */
    .content {
      padding: 20px;
    }


    /* Ajuste en móvil cuando el sidebar está abierto */
    @media (max-width: 991px) {
      .main-panel {
        margin-left: 0;
      }
    }

    /* ---------- BOTÓN HAMBURGUESA PARA MOVILES ---------- */
    .hamburger-btn {
      position: fixed;
      top: 15px;
      left: 15px;
      z-index: 1100;
      background: white;
      border: 1px solid #ddd;
      border-radius: 50%;
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      color: #333;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .hamburger-btn:hover {
      background: white;
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    /* Ocultar boton en pantallas grandes */
    .d-lg-none {
      display: block;
    }
    @media (min-width: 992px) {
      .d-lg-none {
        display: none !important;
      }
    }

  `]
})
export class AppComponent {
  title = 'frontend-angular-clean-architecture';

  /** Controla si el sidebar está visible en móvil */
  sidebarOpen = false;


  /** Alterna el estado del sidebar (abrir/cerrar) */
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    console.log('Sidebar:', this.sidebarOpen ? 'ABIERTO' : 'CERRADO'); // ← PARA DEBUG
  }
  
}
