import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { OrderService } from '../../core/services/order.service';
import { Observable, combineLatest, switchMap, map, startWith, catchError, of } from 'rxjs';

interface ProfileStats {
  orders: number;
  favs: number;
  total: number;
  loading: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink, FormsModule],
  template: `
    @if (userService.currentUser$ | async; as user) {
      <div class="profile-page fade-in">

        <!-- Hero -->
        <div class="hero">
          <div class="hero-bg"></div>
          <div class="hero-content">
            <div class="big-avatar">
              {{ user.firstName[0] }}{{ user.lastName[0] }}
            </div>
            <div class="hero-info">
              <h1>{{ user.firstName }} {{ user.lastName }}</h1>
              <p class="hero-email">{{ user.email }}</p>
              <div class="hero-badges">
                <span class="badge badge-green">Membre actif</span>
                @if (user.role === 'ADMIN') {
                  <span class="badge badge-blue">Admin</span>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs-bar">
          <button class="tab" [class.active]="tab === 'info'"     (click)="tab='info'">👤 Profil</button>
          <button class="tab" [class.active]="tab === 'security'" (click)="tab='security'">🔒 Sécurité</button>
          <button class="tab" [class.active]="tab === 'activity'" (click)="tab='activity'">📦 Activité</button>
        </div>

        <!-- Tab: Profil -->
        @if (tab === 'info') {
          <div class="tab-content fade-up">
            <div class="section-grid">

              <!-- Info card -->
              <div class="info-card card">
                <div class="card-title">Informations personnelles</div>

                @if (!editing) {
                  <div class="info-rows">
                    <div class="info-row">
                      <span class="info-label">Prénom</span>
                      <span class="info-value">{{ user.firstName }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Nom</span>
                      <span class="info-value">{{ user.lastName }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Email</span>
                      <span class="info-value">{{ user.email }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Rôle</span>
                      <span class="info-value">
                        <span class="badge" [class]="user.role === 'ADMIN' ? 'badge-blue' : 'badge-green'">
                          {{ user.role }}
                        </span>
                      </span>
                    </div>
                  </div>
                  <button class="btn btn-secondary edit-btn" (click)="startEdit(user)">
                    ✏️ Modifier le profil
                  </button>
                } @else {
                  <div class="edit-form">
                    <div class="name-row">
                      <div class="input-group">
                        <label>Prénom</label>
                        <input [(ngModel)]="editFirst" placeholder="Prénom"/>
                      </div>
                      <div class="input-group">
                        <label>Nom</label>
                        <input [(ngModel)]="editLast" placeholder="Nom"/>
                      </div>
                    </div>
                    <div class="input-group">
                      <label>Email</label>
                      <input [(ngModel)]="editEmail" type="email" placeholder="Email"/>
                    </div>
                    @if (editSuccess) {
                      <div class="alert-success fade-in">✓ Profil mis à jour !</div>
                    }
                    <div class="edit-actions">
                      <button class="btn btn-primary" (click)="saveEdit()">Enregistrer</button>
                      <button class="btn btn-secondary" (click)="editing=false">Annuler</button>
                    </div>
                  </div>
                }
              </div>

              <!-- Stats card -->
              <div class="stats-card card">
                <div class="card-title">Statistiques</div>
                @if (stats$ | async; as stats) {
                <div class="stat-grid">
                  <div class="stat-item">
                    <span class="stat-icon">📦</span>
                    <span class="stat-num" [class.loading-val]="stats.loading">
                      {{ stats.loading ? '…' : stats.orders }}
                    </span>
                    <span class="stat-desc">Commandes</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-icon">❤️</span>
                    <span class="stat-num">{{ stats.favs }}</span>
                    <span class="stat-desc">Favoris</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-icon">⭐</span>
                    <span class="stat-num">0</span>
                    <span class="stat-desc">Avis</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-icon">💰</span>
                    <span class="stat-num" [class.loading-val]="stats.loading">
                      {{ stats.loading ? '…' : (stats.total | currency:'EUR':'symbol':'1.0-0') }}
                    </span>
                    <span class="stat-desc">Total dépensé</span>
                  </div>
                </div>
                }

                @if (stats$ | async; as stats) {
                  <div class="membership">
                    <div class="membership-bar">
                      <div class="bar-fill" [style.width]="getMembershipPct(stats.orders) + '%'"></div>
                    </div>
                    <p>{{ getMembershipLabel(stats.orders) }}</p>
                  </div>
                }
              </div>

            </div>
          </div>
        }

        <!-- Tab: Sécurité -->
        @if (tab === 'security') {
          <div class="tab-content fade-up">
            <div class="security-grid">
              <div class="card">
                <div class="card-title">Mot de passe</div>
                <p class="security-desc">Changez votre mot de passe régulièrement pour sécuriser votre compte.</p>
                <div class="input-group">
                  <label>Nouveau mot de passe</label>
                  <input type="password" [(ngModel)]="newPass" placeholder="Nouveau mot de passe"/>
                </div>
                <div class="input-group">
                  <label>Confirmer</label>
                  <input type="password" [(ngModel)]="confirmPass" placeholder="Confirmer le mot de passe"/>
                </div>
                @if (newPass && confirmPass && newPass !== confirmPass) {
                  <div class="alert-error">Les mots de passe ne correspondent pas</div>
                }
                <button class="btn btn-primary" [disabled]="!newPass || newPass !== confirmPass">
                  🔒 Mettre à jour
                </button>
              </div>

              <div class="card">
                <div class="card-title">Sessions actives</div>
                <div class="session-item">
                  <div class="session-icon">💻</div>
                  <div>
                    <strong>Navigateur web</strong>
                    <p>Connecté maintenant · Cette session</p>
                  </div>
                  <span class="badge badge-green">Actif</span>
                </div>
              </div>

              <div class="card danger-zone">
                <div class="card-title danger-title">⚠️ Zone dangereuse</div>
                <p class="security-desc">La déconnexion efface votre session locale.</p>
                <button class="btn btn-danger" (click)="logout()">⏏ Se déconnecter</button>
              </div>
            </div>
          </div>
        }

        <!-- Tab: Activité -->
        @if (tab === 'activity') {
          <div class="tab-content fade-up">
            <div class="empty-activity card">
              <span class="empty-icon">📦</span>
              <h3>Aucune commande pour l'instant</h3>
              <p>Explorez notre catalogue et passez votre première commande</p>
              <a routerLink="/" class="btn btn-primary">Voir le catalogue</a>
            </div>
          </div>
        }

      </div>
    } @else {
      <div class="not-logged">
        <span>🔒</span>
        <h2>Accès restreint</h2>
        <p>Vous devez être connecté pour accéder à votre profil.</p>
        <a routerLink="/login" class="btn btn-primary">Se connecter</a>
      </div>
    }
  `,
  styles: [`
    .profile-page { max-width: 900px; margin: 0 auto; padding: 0 1.5rem 3rem; }

    /* ─── Hero ─── */
    .hero {
      position: relative; overflow: hidden;
      border-radius: 0 0 var(--radius) var(--radius);
      margin: 0 -1.5rem 2rem; padding: 2.5rem 2rem;
    }

    .hero-bg {
      position: absolute; inset: 0;
      background: linear-gradient(135deg, #1a1a38 0%, #0f2040 50%, #0d2828 100%);
      border-bottom: 1px solid var(--border);
    }

    .hero-bg::before {
      content: '';
      position: absolute; inset: 0;
      background:
        radial-gradient(ellipse at 20% 50%, rgba(0,168,89,0.12) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 50%, rgba(51,85,238,0.10) 0%, transparent 60%);
    }

    .hero-content {
      position: relative; z-index: 1;
      display: flex; align-items: center; gap: 1.8rem;
    }

    .big-avatar {
      width: 90px; height: 90px; border-radius: 50%;
      background: linear-gradient(135deg, var(--blue) 0%, var(--green) 100%);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.8rem; font-weight: 800; color: #fff;
      text-transform: uppercase; flex-shrink: 0;
      box-shadow: 0 0 0 4px rgba(0,255,136,0.2), 0 0 30px rgba(0,255,136,0.15);
    }

    .hero-info { display: flex; flex-direction: column; gap: 0.4rem; }

    .hero-info h1 {
      font-size: 1.8rem; font-weight: 800;
      color: var(--text); letter-spacing: -0.03em;
    }

    .hero-email { color: var(--muted); font-size: 0.9rem; }

    .hero-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }

    /* ─── Tabs ─── */
    .tabs-bar {
      display: flex; gap: 0.3rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 2rem;
    }

    .tab {
      padding: 0.6rem 1.2rem;
      background: none; border: none;
      color: var(--muted); cursor: pointer;
      font-size: 0.88rem; font-weight: 500;
      font-family: inherit;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      transition: var(--transition);
    }

    .tab:hover { color: var(--text); }

    .tab.active {
      color: var(--text);
      border-bottom-color: var(--green);
    }

    /* ─── Tab content ─── */
    .tab-content { }

    .section-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 640px) { .section-grid { grid-template-columns: 1fr; } }

    .card-title {
      font-size: 0.8rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.1em;
      color: var(--muted); margin-bottom: 1.2rem;
    }

    /* Info rows */
    .info-rows { display: flex; flex-direction: column; gap: 0; }

    .info-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.75rem 0; border-bottom: 1px solid var(--border);
    }

    .info-row:last-child { border-bottom: none; }

    .info-label { font-size: 0.82rem; color: var(--muted); }
    .info-value { font-size: 0.9rem; font-weight: 500; color: var(--text); }

    .edit-btn { width: 100%; margin-top: 1.2rem; }

    .edit-form { display: flex; flex-direction: column; gap: 1rem; }

    .name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }

    .input-group { display: flex; flex-direction: column; gap: 0.35rem; }

    .input-group label {
      font-size: 0.72rem; font-weight: 600;
      color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em;
    }

    .input-group input {
      padding: 0.65rem 0.9rem;
      background: var(--surface2); border: 1.5px solid var(--border);
      border-radius: var(--radius-sm); color: var(--text);
      font-size: 0.9rem; font-family: inherit; outline: none;
      transition: var(--transition);
    }

    .input-group input:focus {
      border-color: var(--blue);
      box-shadow: 0 0 0 3px var(--blue-dim);
    }

    .input-group input::placeholder { color: var(--muted); }

    .edit-actions { display: flex; gap: 0.8rem; margin-top: 0.3rem; }

    .alert-success {
      background: var(--green-dim); border: 1px solid var(--green);
      color: var(--green); padding: 0.65rem 0.9rem;
      border-radius: var(--radius-sm); font-size: 0.82rem;
    }

    .alert-error {
      background: var(--red-dim); border: 1px solid var(--red);
      color: var(--red); padding: 0.65rem 0.9rem;
      border-radius: var(--radius-sm); font-size: 0.82rem;
    }

    /* Stats card */
    .stat-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.2rem;
    }

    .stat-item {
      display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
      padding: 1rem; background: var(--surface2);
      border-radius: var(--radius-sm); border: 1px solid var(--border);
    }

    .stat-icon { font-size: 1.4rem; }
    .stat-num { font-size: 1.3rem; font-weight: 800; color: var(--text); }
    .stat-num.loading-val { color: var(--muted); font-size: 1rem; }
    .stat-desc { font-size: 0.72rem; color: var(--muted); }

    .membership { margin-top: 0.5rem; }

    .membership-bar {
      height: 6px; background: var(--border);
      border-radius: 3px; overflow: hidden; margin-bottom: 0.4rem;
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--blue), var(--green));
      border-radius: 3px;
    }

    .membership p { font-size: 0.78rem; color: var(--muted); }

    /* Security tab */
    .security-grid { display: flex; flex-direction: column; gap: 1.2rem; }

    .security-desc { font-size: 0.85rem; color: var(--muted); margin-bottom: 1rem; }

    .session-item {
      display: flex; align-items: center; gap: 1rem;
      padding: 1rem; background: var(--surface2);
      border-radius: var(--radius-sm); border: 1px solid var(--border);
    }

    .session-icon { font-size: 1.5rem; }

    .session-item strong { display: block; font-size: 0.9rem; color: var(--text); }
    .session-item p { font-size: 0.78rem; color: var(--muted); margin: 0; }
    .session-item .badge { margin-left: auto; }

    .danger-zone { border-color: rgba(255,68,102,0.3); }
    .danger-title { color: var(--red) !important; }

    /* Activity tab */
    .empty-activity {
      display: flex; flex-direction: column;
      align-items: center; gap: 1rem; padding: 4rem 2rem; text-align: center;
    }

    .empty-icon { font-size: 3.5rem; }
    .empty-activity h3 { font-size: 1.2rem; color: var(--text); }
    .empty-activity p { color: var(--muted); font-size: 0.9rem; }

    /* Not logged */
    .not-logged {
      min-height: calc(100vh - 64px);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 1rem; text-align: center;
    }

    .not-logged span { font-size: 3rem; }
    .not-logged h2 { font-size: 1.5rem; color: var(--text); }
    .not-logged p { color: var(--muted); }
    .not-logged .btn { margin-top: 0.5rem; }
  `]
})
export class ProfileComponent {
  tab: 'info' | 'security' | 'activity' = 'info';
  editing = false;
  editFirst = '';
  editLast = '';
  editEmail = '';
  editSuccess = false;
  newPass = '';
  confirmPass = '';

  stats$: Observable<ProfileStats>;

  constructor(
    public userService: UserService,
    private router: Router,
    private favoritesService: FavoritesService,
    private orderService: OrderService
  ) {
    this.stats$ = combineLatest([
      this.userService.currentUser$,
      this.favoritesService.favorites$
    ]).pipe(
      switchMap(([user, favs]) => {
        if (!user) {
          return of({ orders: 0, favs: favs.length, total: 0, loading: false });
        }
        return this.orderService.getUserOrders(user.id).pipe(
          map(orders => ({
            orders: orders.length,
            favs: favs.length,
            total: orders.reduce((s, o) => s + o.totalAmount, 0),
            loading: false
          })),
          startWith({ orders: 0, favs: favs.length, total: 0, loading: true }),
          catchError(() => of({ orders: 0, favs: favs.length, total: 0, loading: false }))
        );
      })
    );
  }

  startEdit(user: any): void {
    this.editFirst = user.firstName;
    this.editLast = user.lastName;
    this.editEmail = user.email;
    this.editing = true;
    this.editSuccess = false;
  }

  saveEdit(): void {
    this.editSuccess = true;
    setTimeout(() => { this.editing = false; this.editSuccess = false; }, 1500);
  }

  getMembershipPct(orders: number): number {
    if (orders >= 20) return 100;
    if (orders >= 10) return 60 + (orders - 10) * 4;
    return Math.min(orders * 6, 60);
  }

  getMembershipLabel(orders: number): string {
    if (orders >= 20) return '🥇 Gold · Membre fidèle';
    if (orders >= 10) return `🥈 Silver → Gold (${orders}/20 commandes)`;
    return `🥉 Bronze → Silver (${orders}/10 commandes)`;
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
