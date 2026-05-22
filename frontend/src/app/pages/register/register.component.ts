import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">

      <!-- Left Panel -->
      <div class="auth-panel fade-in">
        <div class="panel-content">
          <div class="logo-area">
            <div class="logo-icon">🛒</div>
            <h1>Rejoignez<br><strong>CloudMart</strong></h1>
            <p class="tagline">Créez votre compte en 30 secondes</p>
          </div>

          <div class="perks">
            <div class="perk">
              <div class="perk-check">✓</div>
              <span>Accès à 500+ produits premium</span>
            </div>
            <div class="perk">
              <div class="perk-check">✓</div>
              <span>Suivi de commandes en temps réel</span>
            </div>
            <div class="perk">
              <div class="perk-check">✓</div>
              <span>Offres exclusives membres</span>
            </div>
            <div class="perk">
              <div class="perk-check">✓</div>
              <span>Support prioritaire 7j/7</span>
            </div>
          </div>

          <div class="trust-badge">
            <span class="shield">🛡️</span>
            <div>
              <strong>Données protégées</strong>
              <p>Conforme RGPD · Chiffrement SSL</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Form or Success -->
      <div class="auth-form">

        @if (!success) {
          <div class="form-inner fade-up">
            <div class="form-header">
              <h2>Créer un compte</h2>
              <p>Rejoignez la communauté CloudMart</p>
            </div>

            <div class="name-row">
              <div class="input-group">
                <label>Prénom</label>
                <input [(ngModel)]="firstName" placeholder="Wisdom" (keyup.enter)="register()"/>
              </div>
              <div class="input-group">
                <label>Nom</label>
                <input [(ngModel)]="lastName" placeholder="Muonaka" (keyup.enter)="register()"/>
              </div>
            </div>

            <div class="input-group">
              <label>Adresse email</label>
              <div class="input-icon-wrap">
                <span class="input-icon">✉</span>
                <input
                  [(ngModel)]="email"
                  type="email"
                  placeholder="email@exemple.com"
                  (keyup.enter)="register()"
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
                  placeholder="Min. 6 caractères"
                  (keyup.enter)="register()"
                />
                <button class="toggle-pass" (click)="showPass = !showPass" type="button">
                  {{ showPass ? '🙈' : '👁️' }}
                </button>
              </div>
              @if (password.length > 0) {
                <div class="password-strength">
                  <div class="strength-bar">
                    <div class="strength-fill" [style.width]="strengthPct + '%'" [class]="strengthClass"></div>
                  </div>
                  <span class="strength-label" [class]="strengthClass">{{ strengthLabel }}</span>
                </div>
              }
            </div>

            @if (error) {
              <div class="alert-error fade-in">⚠️ {{ error }}</div>
            }

            <button
              class="btn btn-primary submit-btn"
              (click)="register()"
              [disabled]="loading || !firstName || !lastName || !email || !password"
            >
              @if (loading) {
                <span class="spinner"></span> Création du compte...
              } @else {
                Créer mon compte →
              }
            </button>

            <p class="switch-link">
              Déjà un compte ? <a routerLink="/login">Se connecter</a>
            </p>
          </div>
        }

        @if (success) {
          <div class="success-screen fade-up">
            <div class="success-icon bounce-in">✓</div>
            <h2>Compte créé ! 🎉</h2>
            <p>Bienvenue <strong>{{ firstName }}</strong>, votre compte CloudMart est prêt.</p>
            <div class="user-card">
              <div class="user-avatar">{{ firstName[0] }}{{ lastName[0] }}</div>
              <div>
                <strong>{{ firstName }} {{ lastName }}</strong>
                <p>{{ email }}</p>
              </div>
              <span class="badge badge-green">Nouveau membre</span>
            </div>
            <p class="redirect-msg">Redirection vers la connexion...</p>
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
          </div>
        }

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

    /* ─── Left Panel ─── */
    .auth-panel {
      background: linear-gradient(145deg, #0d0d1a 0%, #111128 50%, #0d1a1a 100%);
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
      width: 350px; height: 350px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 70%);
      top: -80px; left: -80px;
    }

    .auth-panel::after {
      content: '';
      position: absolute;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(85,102,255,0.07) 0%, transparent 70%);
      bottom: -60px; right: -60px;
    }

    .panel-content {
      position: relative; z-index: 1;
      display: flex; flex-direction: column; gap: 2.5rem;
      max-width: 340px; width: 100%;
    }

    .logo-area { display: flex; flex-direction: column; gap: 0.4rem; }
    .logo-icon { font-size: 2.5rem; margin-bottom: 0.3rem; }

    .logo-area h1 {
      font-size: 1.9rem; font-weight: 300;
      color: #ffffff; letter-spacing: -0.03em; line-height: 1.2;
    }

    .logo-area h1 strong { font-weight: 800; color: var(--green); }
    .tagline { color: rgba(255,255,255,0.6); font-size: 0.9rem; }

    .perks { display: flex; flex-direction: column; gap: 0.9rem; }

    .perk {
      display: flex; align-items: center; gap: 0.8rem;
      font-size: 0.88rem; color: rgba(255,255,255,0.85);
    }

    .perk-check {
      width: 20px; height: 20px; border-radius: 50%;
      background: var(--green-dim); border: 1px solid var(--green);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.65rem; color: var(--green); font-weight: 800;
      flex-shrink: 0;
    }

    .trust-badge {
      display: flex; align-items: center; gap: 0.8rem;
      padding: 1rem; border-radius: var(--radius-sm);
      background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
    }

    .shield { font-size: 1.8rem; }

    .trust-badge strong { display: block; font-size: 0.88rem; color: #ffffff; }
    .trust-badge p { font-size: 0.75rem; color: rgba(255,255,255,0.6); margin: 0; }

    /* ─── Form ─── */
    .auth-form {
      display: flex; align-items: center; justify-content: center;
      padding: 3rem; background: var(--bg);
    }

    .form-inner {
      width: 100%; max-width: 420px;
      display: flex; flex-direction: column; gap: 1.2rem;
    }

    .form-header h2 {
      font-size: 1.8rem; font-weight: 800;
      letter-spacing: -0.03em; color: var(--text);
    }

    .form-header p { color: var(--muted); font-size: 0.9rem; margin-top: 0.3rem; }

    .name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

    .input-group { display: flex; flex-direction: column; gap: 0.4rem; }

    .input-group label {
      font-size: 0.75rem; font-weight: 600;
      color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em;
    }

    .input-group input {
      padding: 0.75rem 1rem;
      background: var(--surface); border: 1.5px solid var(--border);
      border-radius: var(--radius-sm); color: var(--text);
      font-size: 0.95rem; font-family: inherit;
      transition: var(--transition); outline: none;
    }

    .input-group input:focus {
      border-color: var(--blue); background: var(--surface2);
      box-shadow: 0 0 0 3px var(--blue-dim);
    }

    .input-group input::placeholder { color: var(--muted); }

    .input-icon-wrap {
      position: relative; display: flex; align-items: center;
    }

    .input-icon {
      position: absolute; left: 0.9rem;
      font-size: 0.9rem; pointer-events: none; opacity: 0.5;
    }

    .input-icon-wrap input {
      width: 100%; padding-left: 2.6rem;
    }

    .toggle-pass {
      position: absolute; right: 0.8rem;
      background: none; border: none; cursor: pointer;
      font-size: 1rem; opacity: 0.6; transition: var(--transition);
    }

    .toggle-pass:hover { opacity: 1; }

    /* Password strength */
    .password-strength { display: flex; align-items: center; gap: 0.6rem; margin-top: 0.3rem; }

    .strength-bar {
      flex: 1; height: 3px; background: var(--border);
      border-radius: 2px; overflow: hidden;
    }

    .strength-fill {
      height: 100%; border-radius: 2px;
      transition: width 0.3s ease, background-color 0.3s ease;
    }

    .strength-fill.weak   { background: var(--red); }
    .strength-fill.medium { background: var(--gold); }
    .strength-fill.strong { background: var(--green); }

    .strength-label { font-size: 0.72rem; font-weight: 600; }
    .strength-label.weak   { color: var(--red); }
    .strength-label.medium { color: var(--gold); }
    .strength-label.strong { color: var(--green); }

    .alert-error {
      background: var(--red-dim); border: 1px solid var(--red);
      color: var(--red); padding: 0.75rem 1rem;
      border-radius: var(--radius-sm); font-size: 0.85rem;
    }

    .submit-btn {
      width: 100%; padding: 0.9rem; font-size: 1rem;
      display: flex; align-items: center; justify-content: center; gap: 0.6rem;
      margin-top: 0.3rem;
    }

    .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

    .switch-link { text-align: center; font-size: 0.88rem; color: var(--muted); }
    .switch-link a { color: var(--blue); font-weight: 600; text-decoration: none; }
    .switch-link a:hover { color: var(--green); }

    /* ─── Success screen ─── */
    .success-screen {
      width: 100%; max-width: 400px;
      display: flex; flex-direction: column;
      align-items: center; gap: 1.4rem; text-align: center;
    }

    .success-icon {
      width: 80px; height: 80px; border-radius: 50%;
      background: linear-gradient(135deg, var(--green) 0%, #00cc6a 100%);
      display: flex; align-items: center; justify-content: center;
      font-size: 2rem; font-weight: 800; color: #000;
      animation: bounce-in 0.6s cubic-bezier(0.68,-0.55,0.265,1.55) both;
      box-shadow: 0 0 40px rgba(0,255,136,0.4);
    }

    .success-screen h2 {
      font-size: 2rem; font-weight: 800;
      color: var(--text); letter-spacing: -0.03em;
    }

    .success-screen > p { color: var(--muted); font-size: 0.95rem; }
    .success-screen > p strong { color: var(--text); }

    .user-card {
      display: flex; align-items: center; gap: 1rem;
      padding: 1rem 1.5rem; width: 100%;
      background: var(--surface); border: 1px solid var(--green);
      border-radius: var(--radius); box-shadow: 0 0 20px rgba(0,255,136,0.1);
      text-align: left;
    }

    .user-avatar {
      width: 48px; height: 48px; border-radius: 50%;
      background: linear-gradient(135deg, var(--blue) 0%, var(--green) 100%);
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; font-weight: 800; color: #fff;
      text-transform: uppercase; flex-shrink: 0;
    }

    .user-card strong { display: block; font-size: 0.95rem; color: var(--text); }
    .user-card p { font-size: 0.8rem; color: var(--muted); margin: 0; }

    .redirect-msg { font-size: 0.82rem; color: var(--muted); }

    .progress-bar {
      width: 100%; height: 3px;
      background: var(--border); border-radius: 2px; overflow: hidden;
    }

    .progress-fill {
      height: 100%; width: 0%;
      background: linear-gradient(90deg, var(--green), var(--blue));
      border-radius: 2px;
      animation: progressLoad 1.5s ease forwards;
    }

    @keyframes progressLoad {
      from { width: 0%; }
      to   { width: 100%; }
    }

    @keyframes bounce-in {
      0%   { transform: scale(0.3); opacity: 0; }
      50%  { transform: scale(1.1); }
      70%  { transform: scale(0.95); }
      100% { transform: scale(1); opacity: 1; }
    }
  `]
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  error = '';
  success = false;
  loading = false;
  showPass = false;

  get strengthPct(): number {
    const p = this.password;
    if (p.length < 4) return 25;
    if (p.length < 8 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return 55;
    return 100;
  }

  get strengthClass(): string {
    return this.strengthPct < 40 ? 'weak' : this.strengthPct < 80 ? 'medium' : 'strong';
  }

  get strengthLabel(): string {
    return this.strengthPct < 40 ? 'Faible' : this.strengthPct < 80 ? 'Moyen' : 'Fort';
  }

  constructor(
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  register(): void {
    if (this.loading || !this.firstName || !this.lastName || !this.email || !this.password) return;
    this.loading = true;
    this.error = '';
    this.userService.register({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.success = true;
          this.loading = false;
        });
        setTimeout(() => this.router.navigate(['/login']), 2200);
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.error = err.error?.message || 'Erreur lors de l\'inscription';
          this.loading = false;
        });
      }
    });
  }
}
