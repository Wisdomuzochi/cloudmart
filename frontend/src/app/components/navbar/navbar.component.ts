import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { FavoritesService } from '../../core/services/favorites.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, AsyncPipe],
  template: `
    <nav class="navbar">
      <a routerLink="/" class="brand">
        <span class="brand-icon">🛒</span>
        <span class="brand-text">Cloud<strong>Mart</strong></span>
      </a>

      <div class="links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-link">Accueil</a>
        <a routerLink="/cart" routerLinkActive="active" class="nav-link">
          Panier
        </a>
        <a routerLink="/favorites" routerLinkActive="active" class="nav-link fav-link">
          ❤️
          @if ((favoritesService.favorites$ | async)?.length; as count) {
            <span class="fav-count">{{ count }}</span>
          }
        </a>

        @if (userService.currentUser$ | async; as user) {
          <a routerLink="/orders" routerLinkActive="active" class="nav-link">Commandes</a>
          @if (user.role === 'ADMIN') {
            <a routerLink="/admin" routerLinkActive="active" class="nav-link admin-link">⚙️ Admin</a>
          }
          <a routerLink="/profile" class="avatar-link" routerLinkActive="active">
            <div class="avatar">{{ user.firstName[0] }}{{ user.lastName[0] }}</div>
            <span class="avatar-name">{{ user.firstName }}</span>
          </a>
          <button class="btn btn-danger logout-btn" (click)="logout()">⏏ Quitter</button>
        } @else {
          <a routerLink="/login" routerLinkActive="active" class="nav-link">Connexion</a>
          <a routerLink="/register" class="btn btn-primary nav-cta">S'inscrire</a>
        }
        <a routerLink="/about" routerLinkActive="active" class="nav-link">À propos</a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
      height: 64px;
      background: #ffffff;
      border-bottom: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 200;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
    }

    .brand-icon { font-size: 1.5rem; }

    .brand-text {
      font-size: 1.3rem;
      font-weight: 400;
      color: var(--text);
      letter-spacing: -0.02em;
    }

    .brand-text strong {
      color: var(--green);
      font-weight: 800;
    }

    .links {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .nav-link {
      color: var(--muted);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.4rem 0.8rem;
      border-radius: var(--radius-sm);
      transition: var(--transition);
    }

    .nav-link:hover {
      color: var(--text);
      background: var(--surface2);
    }

    .nav-link.active {
      color: var(--green-dark);
      background: var(--green-dim);
      font-weight: 600;
    }

    .avatar-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      padding: 0.3rem 0.7rem;
      border-radius: 999px;
      border: 1px solid var(--border);
      transition: var(--transition);
      cursor: pointer;
    }

    .avatar-link:hover, .avatar-link.active {
      border-color: var(--green);
      background: var(--green-dim);
    }

    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--blue) 0%, var(--green) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      font-weight: 800;
      color: #fff;
      text-transform: uppercase;
    }

    .avatar-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text);
    }

    .fav-link {
      position: relative;
      font-size: 1rem;
      padding: 0.4rem 0.6rem;
    }

    .fav-count {
      position: absolute;
      top: -2px; right: -4px;
      background: var(--red);
      color: #fff;
      font-size: 0.6rem;
      font-weight: 800;
      min-width: 16px; height: 16px;
      border-radius: 999px;
      display: flex; align-items: center; justify-content: center;
      padding: 0 3px;
      line-height: 1;
    }

    .admin-link {
      color: #00a859 !important;
      font-weight: 700;
    }

    .admin-link.active {
      background: rgba(0,168,89,0.12) !important;
      color: #007d42 !important;
    }

    .logout-btn {
      font-size: 0.78rem;
      padding: 0.35rem 0.8rem;
    }

    .nav-cta {
      font-size: 0.85rem;
      padding: 0.45rem 1.1rem;
    }
  `]
})
export class NavbarComponent {
  constructor(public userService: UserService, public favoritesService: FavoritesService) {}

  logout(): void {
    this.userService.logout();
  }
}
