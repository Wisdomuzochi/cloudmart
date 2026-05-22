import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { UserService } from './core/services/user.service';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NavbarComponent, CommonModule],
  template: `
    <app-navbar />
    <main [class]="isAdmin ? 'container-full' : 'container'">
      <router-outlet />
    </main>
    @if (showAdminBtn) {
      <a routerLink="/admin" class="admin-fab" title="Panneau Admin">
        ⚙️ Admin
      </a>
    }
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem;
    }
    .container-full {
      padding: 0;
    }
    .admin-fab {
      position: fixed;
      bottom: 1.5rem;
      left: 1.5rem;
      background: linear-gradient(135deg, #00c870, #00ff88);
      color: #000;
      font-weight: 800;
      font-size: 0.82rem;
      padding: 0.55rem 1.1rem;
      border-radius: 999px;
      text-decoration: none;
      box-shadow: 0 4px 20px rgba(0,255,136,0.4);
      z-index: 999;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .admin-fab:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 28px rgba(0,255,136,0.55);
    }
  `]
})
export class App {
  isAdmin = false;
  showAdminBtn = false;

  constructor(private userService: UserService, private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects)
    ).subscribe(url => {
      this.isAdmin = url.startsWith('/admin');
      const user = this.userService.getCurrentUser();
      this.showAdminBtn = !!user && user.role === 'ADMIN' && !this.isAdmin;
    });

    this.userService.currentUser$.subscribe(user => {
      this.showAdminBtn = !!user && user.role === 'ADMIN' && !this.isAdmin;
    });
  }
}
