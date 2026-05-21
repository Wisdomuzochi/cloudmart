import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <main class="container">
      <router-outlet />
    </main>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem;
    }
  `]
})
export class App {}
