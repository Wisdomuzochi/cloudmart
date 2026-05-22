import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">

      <!-- Left Panel -->
      <div class="auth-panel fade-in">
        <div class="panel-content">
          <div class="logo-area">
            <div class="logo-icon">🛒</div>
            <h1>Cloud<strong>Mart</strong></h1>
            <p class="tagline">Votre marketplace premium</p>
          </div>

          <div class="features">
            <div class="feature">
              <span class="feat-icon">⚡</span>
              <div>
                <strong>Livraison express</strong>
                <p>En 24h partout en France</p>
              </div>
            </div>
            <div class="feature">
              <span class="feat-icon">🛡️</span>
              <div>
                <strong>Paiement sécurisé</strong>
                <p>Transactions chiffrées SSL</p>
              </div>
            </div>
            <div class="feature">
              <span class="feat-icon">🔄</span>
              <div>
                <strong>Retours gratuits</strong>
                <p>Sous 30 jours sans justification</p>
              </div>
            </div>
          </div>

          <div class="stats-row">
            <div class="stat">
              <span class="stat-n">12k+</span>
              <span class="stat-l">Clients</span>
            </div>
            <div class="stat">
              <span class="stat-n">500+</span>
              <span class="stat-l">Produits</span>
            </div>
            <div class="stat">
              <span class="stat-n">4.9★</span>
              <span class="stat-l">Note</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="auth-form fade-up">
        <div class="form-inner">
          <div class="form-header">
            <h2>Bon retour 👋</h2>
            <p>Connectez-vous à votre compte</p>
          </div>

          <div class="input-group">
            <label>Adresse email</label>
            <div class="input-icon-wrap">
              <span class="input-icon">✉</span>
              <input
                [(ngModel)]="email"
                type="email"
                placeholder="email@exemple.com"
                (keyup.enter)="login()"
                [class.input-error]="error"
              />
            </div>
          </div>

          <div class="input-group">
            <label>Mot de passe</label>
            <div class="input-icon-wrap">
              <span class="input-icon">🔒</span>
              <input
                [(ngModel)]="password"
                [type]="showPass ? 'text' : 'password'"
                placeholder="••••••••"
                (keyup.enter)="login()"
                [class.input-error]="error"
              />
              <button class="toggle-pass" (click)="showPass = !showPass" type="button">
                {{ showPass ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          @if (error) {
            <div class="alert-error fade-in">
              ⚠️ {{ error }}
            </div>
          }

          <button
            class="btn btn-primary submit-btn"
            (click)="login()"
            [disabled]="loading || !email || !password"
          >
            @if (loading) {
              <span class="spinner"></span>
              Connexion en cours...
            } @else {
              Se connecter →
            }
          </button>

          <div class="divider"><span>ou</span></div>

          <p class="switch-link">
            Pas encore de compte ?
            <a routerLink="/register">Créer un compte gratuitement</a>
          </p>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 64px);
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 768px) {
      .auth-page { grid-template-columns: 1fr; }
      .auth-panel { display: none; }
    }

    /* ─── Left panel ─── */
    .auth-panel {
      background: linear-gradient(145deg, #0d0d1a 0%, #111128 50%, #0a1628 100%);
      border-right: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      position: relative;
      overflow: hidden;
    }

    .auth-panel::before {
      content: '';
      position: absolute;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%);
      top: -100px;
      right: -100px;
      pointer-events: none;
    }

    .auth-panel::after {
      content: '';
      position: absolute;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(85,102,255,0.08) 0%, transparent 70%);
      bottom: -50px;
      left: -50px;
      pointer-events: none;
    }

    .panel-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
      max-width: 340px;
      width: 100%;
    }

    .logo-area {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .logo-icon {
      font-size: 2.5rem;
      margin-bottom: 0.3rem;
    }

    .logo-area h1 {
      font-size: 2rem;
      font-weight: 300;
      color: #ffffff;
      letter-spacing: -0.04em;
    }

    .logo-area h1 strong {
      font-weight: 800;
      color: var(--green);
    }

    .tagline {
      color: rgba(255,255,255,0.6);
      font-size: 0.9rem;
    }

    .features {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    .feature {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .feat-icon {
      font-size: 1.4rem;
      margin-top: 0.1rem;
    }

    .feature strong {
      display: block;
      font-size: 0.9rem;
      font-weight: 600;
      color: #ffffff;
    }

    .feature p {
      font-size: 0.8rem;
      color: rgba(255,255,255,0.55);
      margin: 0;
    }

    .stats-row {
      display: flex;
      gap: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.12);
    }

    .stat {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .stat-n {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--green);
    }

    .stat-l {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.5);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    /* ─── Right form ─── */
    .auth-form {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      background: var(--bg);
    }

    .form-inner {
      width: 100%;
      max-width: 380px;
      display: flex;
      flex-direction: column;
      gap: 1.4rem;
    }

    .form-header h2 {
      font-size: 1.8rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--text);
    }

    .form-header p {
      color: var(--muted);
      font-size: 0.9rem;
      margin-top: 0.3rem;
    }

    .input-icon-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 0.9rem;
      font-size: 0.9rem;
      pointer-events: none;
      opacity: 0.5;
    }

    .input-icon-wrap input {
      width: 100%;
      padding: 0.8rem 1rem 0.8rem 2.6rem;
      background: var(--surface);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text);
      font-size: 0.95rem;
      font-family: inherit;
      transition: var(--transition);
      outline: none;
    }

    .input-icon-wrap input:focus {
      border-color: var(--blue);
      background: var(--surface2);
      box-shadow: 0 0 0 3px var(--blue-dim);
    }

    .input-icon-wrap input.input-error {
      border-color: var(--red);
    }

    .input-icon-wrap input::placeholder { color: var(--muted); }

    .toggle-pass {
      position: absolute;
      right: 0.8rem;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      opacity: 0.6;
      transition: var(--transition);
    }

    .toggle-pass:hover { opacity: 1; }

    .alert-error {
      background: var(--red-dim);
      border: 1px solid var(--red);
      color: var(--red);
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
    }

    .submit-btn {
      width: 100%;
      padding: 0.9rem;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }

    .divider {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: var(--muted);
      font-size: 0.8rem;
    }

    .divider::before, .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    .switch-link {
      text-align: center;
      font-size: 0.88rem;
      color: var(--muted);
    }

    .switch-link a {
      color: var(--blue);
      font-weight: 600;
      text-decoration: none;
    }

    .switch-link a:hover {
      color: var(--green);
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;
  showPass = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  login(): void {
    if (!this.email || !this.password || this.loading) return;
    this.loading = true;
    this.error = '';
    this.userService.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/profile']),
      error: () => {
        this.ngZone.run(() => {
          this.error = 'Email ou mot de passe incorrect';
          this.loading = false;
        });
      }
    });
  }
}
