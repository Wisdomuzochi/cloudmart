import { Component, NgZone } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-page fade-in">
      <div class="cart-header">
        <h1>🛒 Mon Panier</h1>
        @if (items.length > 0) {
          <span class="item-count">{{ items.length }} article(s)</span>
        }
      </div>

      @if (items.length === 0 && !orderDone) {
        <div class="empty-cart">
          <span class="empty-icon">🛍️</span>
          <h2>Votre panier est vide</h2>
          <p>Ajoutez des produits depuis le catalogue</p>
          <a routerLink="/" class="btn btn-primary">Voir le catalogue</a>
        </div>
      }

      @if (orderDone) {
        <div class="order-success fade-up">
          <div class="success-icon">✓</div>
          <h2>Commande confirmée ! 🎉</h2>
          <p>Votre commande a bien été enregistrée.</p>
          <p class="redirect-hint">Redirection vers vos commandes...</p>
          <a routerLink="/orders" class="btn btn-primary">Voir mes commandes</a>
        </div>
      }

      @if (items.length > 0 && !orderDone) {
        <div class="cart-layout">

          <!-- Items list -->
          <div class="cart-items">
            @for (item of items; track item.productId) {
              <div class="cart-item card">
                <div class="item-icon">{{ getCategoryIcon(item.productName) }}</div>
                <div class="item-info">
                  <span class="item-name">{{ item.productName }}</span>
                  <span class="item-unit">{{ item.unitPrice | currency:'EUR':'symbol':'1.2-2' }} / unité</span>
                </div>
                <div class="qty-ctrl">
                  <button class="qty-btn" (click)="decrease(item)">−</button>
                  <span class="qty-val">{{ item.quantity }}</span>
                  <button class="qty-btn" (click)="increase(item)">+</button>
                </div>
                <span class="item-subtotal">{{ (item.unitPrice * item.quantity) | currency:'EUR':'symbol':'1.2-2' }}</span>
                <button class="remove-btn" (click)="remove(item)" title="Supprimer">✕</button>
              </div>
            }
          </div>

          <!-- Summary -->
          <div class="cart-summary card">
            <div class="summary-title">Récapitulatif</div>

            <div class="summary-lines">
              @for (item of items; track item.productId) {
                <div class="summary-line">
                  <span>{{ item.productName }} × {{ item.quantity }}</span>
                  <span>{{ (item.unitPrice * item.quantity) | currency:'EUR':'symbol':'1.0-0' }}</span>
                </div>
              }
            </div>

            <div class="summary-divider"></div>

            <div class="summary-total">
              <span>Total TTC</span>
              <span class="total-price">{{ total | currency:'EUR':'symbol':'1.2-2' }}</span>
            </div>

            <div class="summary-note">
              <span>🚚</span> Livraison offerte dès 50€
            </div>

            @if (error) {
              <div class="alert-error fade-in">⚠️ {{ error }}</div>
            }

            @if (!isLoggedIn) {
              <div class="login-required">
                <p>🔒 Connectez-vous pour passer commande</p>
                <a routerLink="/login" class="btn btn-primary" style="width:100%;text-align:center">
                  Se connecter
                </a>
              </div>
            } @else {
              <button
                class="btn btn-primary order-btn"
                (click)="order()"
                [disabled]="loading"
              >
                @if (loading) {
                  <span class="spinner"></span> Traitement...
                } @else {
                  ✅ Passer la commande
                }
              </button>
            }

            <button class="clear-btn" (click)="clearCart()">Vider le panier</button>
          </div>

        </div>
      }
    </div>
  `,
  styles: [`
    .cart-page {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem 1.5rem 3rem;
    }

    .cart-header {
      display: flex; align-items: baseline; gap: 1rem; margin-bottom: 2rem;
    }

    .cart-header h1 { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.03em; }

    .item-count {
      font-size: 0.82rem; color: var(--muted);
      background: var(--surface); padding: 0.2rem 0.7rem;
      border-radius: 999px; border: 1px solid var(--border);
    }

    /* Empty */
    .empty-cart {
      display: flex; flex-direction: column;
      align-items: center; gap: 1rem;
      padding: 6rem 2rem; text-align: center;
    }

    .empty-icon { font-size: 4rem; }
    .empty-cart h2 { font-size: 1.3rem; color: var(--text); }
    .empty-cart p { color: var(--muted); }

    /* Order success */
    .order-success {
      display: flex; flex-direction: column;
      align-items: center; gap: 1rem;
      padding: 5rem 2rem; text-align: center;
    }

    .success-icon {
      width: 72px; height: 72px; border-radius: 50%;
      background: linear-gradient(135deg, var(--green), #00cc6a);
      display: flex; align-items: center; justify-content: center;
      font-size: 2rem; font-weight: 800; color: #000;
      box-shadow: 0 0 32px rgba(0,255,136,0.35);
      animation: bounce-in 0.5s cubic-bezier(0.68,-0.55,0.265,1.55) both;
    }

    .order-success h2 { font-size: 1.6rem; font-weight: 800; color: var(--text); }
    .order-success p { color: var(--muted); }
    .redirect-hint { font-size: 0.82rem; }

    @keyframes bounce-in {
      0%   { transform: scale(0.3); opacity: 0; }
      50%  { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }

    /* Layout */
    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 1.5rem;
      align-items: start;
    }

    @media (max-width: 768px) {
      .cart-layout { grid-template-columns: 1fr; }
    }

    /* Items */
    .cart-items { display: flex; flex-direction: column; gap: 0.8rem; }

    .cart-item {
      display: flex; align-items: center; gap: 1rem;
      padding: 1rem 1.2rem;
    }

    .item-icon { font-size: 1.8rem; flex-shrink: 0; }

    .item-info { flex: 1; min-width: 0; }
    .item-name { display: block; font-weight: 600; font-size: 0.95rem; color: var(--text); }
    .item-unit { display: block; font-size: 0.78rem; color: var(--muted); margin-top: 0.1rem; }

    .qty-ctrl { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }

    .qty-btn {
      width: 28px; height: 28px; border-radius: var(--radius-sm);
      background: var(--surface2); border: 1px solid var(--border);
      color: var(--text); cursor: pointer; font-size: 1rem; font-weight: 600;
      display: flex; align-items: center; justify-content: center;
      transition: var(--transition); line-height: 1;
    }

    .qty-btn:hover { border-color: var(--blue); color: var(--blue); }

    .qty-val { min-width: 24px; text-align: center; font-weight: 700; font-size: 0.95rem; }

    .item-subtotal {
      font-weight: 800; color: var(--green); font-size: 1rem;
      min-width: 80px; text-align: right; flex-shrink: 0;
    }

    .remove-btn {
      background: none; border: none; color: var(--muted);
      cursor: pointer; font-size: 0.85rem; padding: 0.3rem;
      border-radius: 50%; transition: var(--transition);
      line-height: 1;
    }

    .remove-btn:hover { color: var(--red); background: var(--red-dim); }

    /* Summary */
    .cart-summary {
      display: flex; flex-direction: column; gap: 0.9rem;
      position: sticky; top: 80px;
    }

    .summary-title {
      font-size: 0.75rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted);
    }

    .summary-lines { display: flex; flex-direction: column; gap: 0.5rem; }

    .summary-line {
      display: flex; justify-content: space-between;
      font-size: 0.83rem; color: var(--muted);
    }

    .summary-divider { height: 1px; background: var(--border); }

    .summary-total {
      display: flex; justify-content: space-between; align-items: baseline;
      font-weight: 700;
    }

    .total-price { font-size: 1.4rem; color: var(--green); letter-spacing: -0.02em; }

    .summary-note {
      display: flex; align-items: center; gap: 0.4rem;
      font-size: 0.78rem; color: var(--muted);
      padding: 0.5rem 0.8rem;
      background: var(--surface2);
      border-radius: var(--radius-sm);
    }

    .alert-error {
      background: var(--red-dim); border: 1px solid var(--red);
      color: var(--red); padding: 0.65rem 0.9rem;
      border-radius: var(--radius-sm); font-size: 0.82rem;
    }

    .login-required {
      display: flex; flex-direction: column; gap: 0.6rem;
      padding: 0.8rem; background: var(--surface2);
      border-radius: var(--radius-sm); border: 1px solid var(--border);
      text-align: center;
    }

    .login-required p { font-size: 0.85rem; color: var(--muted); margin: 0; }

    .order-btn {
      width: 100%; padding: 0.9rem;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      font-size: 0.95rem;
    }

    .order-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

    .clear-btn {
      background: none; border: none; color: var(--muted);
      font-size: 0.78rem; cursor: pointer; text-align: center;
      font-family: inherit; padding: 0.3rem;
      transition: var(--transition);
    }

    .clear-btn:hover { color: var(--red); }
  `]
})
export class CartComponent {

  items: any[] = [];
  loading = false;
  error = '';
  orderDone = false;

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.items = JSON.parse(localStorage.getItem('cart') || '[]');
  }

  get total(): number {
    return this.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  }

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  getCategoryIcon(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('iphone') || n.includes('samsung') || n.includes('galaxy') || n.includes('phone')) return '📱';
    if (n.includes('macbook') || n.includes('laptop') || n.includes('dell') || n.includes('xps')) return '💻';
    if (n.includes('ipad') || n.includes('tab')) return '📲';
    if (n.includes('airpod') || n.includes('sony') || n.includes('wh-') || n.includes('audio')) return '🎧';
    return '📦';
  }

  increase(item: any): void { item.quantity++; this.saveCart(); }

  decrease(item: any): void {
    if (item.quantity > 1) { item.quantity--; this.saveCart(); }
  }

  remove(item: any): void {
    this.items = this.items.filter(i => i.productId !== item.productId);
    this.saveCart();
  }

  clearCart(): void {
    this.items = [];
    localStorage.removeItem('cart');
  }

  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  order(): void {
    const user = this.userService.getCurrentUser();
    if (!user) { this.router.navigate(['/login']); return; }

    this.loading = true;
    this.error = '';

    this.orderService.createOrder({
      userId: user.id,
      userEmail: user.email,
      items: this.items
    }).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.orderDone = true;
          this.loading = false;
          localStorage.removeItem('cart');
          this.items = [];
        });
        setTimeout(() => this.router.navigate(['/orders']), 2500);
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.error = err.error?.message || 'Erreur lors de la commande. Réessayez.';
          this.loading = false;
        });
      }
    });
  }
}
