import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService, Order } from '../../core/services/order.service';
import { UserService } from '../../core/services/user.service';
import { Observable, of, startWith, catchError, map, switchMap } from 'rxjs';

interface OrdersState {
  loading: boolean;
  orders: Order[];
  error: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink],
  template: `
    <div class="orders-page fade-in">
      <div class="page-header">
        <h1>📦 Mes Commandes</h1>
        @if (userService.currentUser$ | async; as user) {
          <span class="user-chip">{{ user.firstName }} {{ user.lastName }}</span>
        }
      </div>

      @if (state$ | async; as state) {
        @if (state.loading) {
          <div class="loading-state">
            <div class="spinner-big"></div>
            <p>Chargement de vos commandes...</p>
          </div>
        } @else if (state.error) {
          <div class="error-state card">
            <span>⚠️</span>
            <p>{{ state.error }}</p>
            @if (state.error.includes('connecté')) {
              <a routerLink="/login" class="btn btn-primary">Se connecter</a>
            }
          </div>
        } @else if (state.orders.length === 0) {
          <div class="empty-state">
            <span class="empty-icon">📭</span>
            <h2>Aucune commande</h2>
            <p>Vous n'avez pas encore passé de commande.</p>
            <a routerLink="/" class="btn btn-primary">Découvrir le catalogue</a>
          </div>
        } @else {
          <div class="orders-list fade-up">
            @for (order of state.orders; track order.id) {
              <div class="order-card card">

                <!-- Header -->
                <div class="order-header">
                  <div class="order-id-block">
                    <span class="order-label">Commande</span>
                    <span class="order-id">#{{ order.id }}</span>
                  </div>
                  <div class="order-meta">
                    <span class="order-date">{{ order.createdAt | date:'dd MMM yyyy, HH:mm' }}</span>
                    <span class="status-badge" [class]="getStatusClass(order.status)">
                      {{ getStatusLabel(order.status) }}
                    </span>
                  </div>
                </div>

                <!-- Items -->
                <div class="order-items">
                  @for (item of order.items; track item.productId) {
                    <div class="order-item">
                      <span class="item-icon">{{ getIcon(item.productName) }}</span>
                      <span class="item-name">{{ item.productName }}</span>
                      <span class="item-qty">× {{ item.quantity }}</span>
                      <span class="item-price">
                        {{ (item.unitPrice * item.quantity) | currency:'EUR':'symbol':'1.2-2' }}
                      </span>
                    </div>
                  }
                </div>

                <!-- Footer -->
                <div class="order-footer">
                  <span class="items-count">{{ order.items.length }} article(s)</span>
                  <div class="order-total">
                    Total : <strong>{{ order.totalAmount | currency:'EUR':'symbol':'1.2-2' }}</strong>
                  </div>
                </div>

              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .orders-page {
      max-width: 760px;
      margin: 0 auto;
      padding: 2rem 1.5rem 3rem;
    }

    .page-header {
      display: flex; align-items: center; gap: 1rem;
      margin-bottom: 2rem; flex-wrap: wrap;
    }

    .page-header h1 { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.03em; }

    .user-chip {
      font-size: 0.82rem; color: var(--muted);
      background: var(--surface); padding: 0.2rem 0.8rem;
      border-radius: 999px; border: 1px solid var(--border);
    }

    /* States */
    .loading-state {
      display: flex; flex-direction: column;
      align-items: center; gap: 1rem; padding: 5rem 2rem; text-align: center;
      color: var(--muted);
    }

    .spinner-big {
      width: 44px; height: 44px;
      border: 3px solid var(--border);
      border-top-color: var(--green);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .error-state {
      display: flex; flex-direction: column;
      align-items: center; gap: 1rem; padding: 3rem; text-align: center;
      color: var(--red); border-color: rgba(255,68,102,0.3);
    }

    .error-state span { font-size: 2rem; }

    .empty-state {
      display: flex; flex-direction: column;
      align-items: center; gap: 1rem; padding: 6rem 2rem; text-align: center;
    }

    .empty-icon { font-size: 4rem; }
    .empty-state h2 { font-size: 1.3rem; color: var(--text); }
    .empty-state p { color: var(--muted); }

    /* Orders list */
    .orders-list { display: flex; flex-direction: column; gap: 1.2rem; }

    .order-card { padding: 0; overflow: hidden; }

    /* Order header */
    .order-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1rem 1.4rem;
      background: var(--surface2);
      border-bottom: 1px solid var(--border);
      flex-wrap: wrap; gap: 0.5rem;
    }

    .order-id-block { display: flex; align-items: baseline; gap: 0.5rem; }

    .order-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); }

    .order-id { font-size: 1rem; font-weight: 800; color: var(--text); }

    .order-meta { display: flex; align-items: center; gap: 0.8rem; }

    .order-date { font-size: 0.78rem; color: var(--muted); }

    .status-badge {
      font-size: 0.68rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.08em;
      padding: 0.25rem 0.7rem; border-radius: 999px;
    }

    .status-pending   { background: rgba(255,170,0,0.15); color: #ffaa00; border: 1px solid rgba(255,170,0,0.4); }
    .status-confirmed { background: var(--green-dim); color: var(--green-dark); border: 1px solid rgba(0,168,89,0.4); }
    .status-paid      { background: var(--blue-dim);  color: var(--blue);  border: 1px solid var(--blue); }
    .status-shipped  { background: rgba(0,180,255,0.15); color: #00b4ff; border: 1px solid rgba(0,180,255,0.4); }
    .status-delivered { background: var(--green-dim); color: var(--green); border: 1px solid var(--green); }
    .status-cancelled { background: var(--red-dim); color: var(--red); border: 1px solid var(--red); }

    /* Items */
    .order-items {
      padding: 0.8rem 1.4rem;
      display: flex; flex-direction: column; gap: 0.5rem;
    }

    .order-item {
      display: flex; align-items: center; gap: 0.8rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border);
      font-size: 0.88rem;
    }

    .order-item:last-child { border-bottom: none; }

    .item-icon { font-size: 1.2rem; flex-shrink: 0; }
    .item-name { flex: 1; color: var(--text); font-weight: 500; }
    .item-qty { color: var(--muted); min-width: 40px; }
    .item-price { color: var(--green); font-weight: 700; min-width: 80px; text-align: right; }

    /* Footer */
    .order-footer {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.8rem 1.4rem;
      background: var(--surface2);
      border-top: 1px solid var(--border);
    }

    .items-count { font-size: 0.78rem; color: var(--muted); }

    .order-total { font-size: 0.9rem; color: var(--muted); }
    .order-total strong { color: var(--green); font-size: 1.1rem; }
  `]
})
export class OrdersComponent {

  state$: Observable<OrdersState>;

  constructor(
    public userService: UserService,
    private orderService: OrderService
  ) {
    this.state$ = this.userService.currentUser$.pipe(
      switchMap(user => {
        if (!user) {
          return of({ loading: false, orders: [], error: 'Vous devez être connecté pour voir vos commandes.' });
        }
        return this.orderService.getUserOrders(user.id).pipe(
          map(orders => ({ loading: false, orders, error: '' })),
          startWith({ loading: true, orders: [], error: '' }),
          catchError(() => of({ loading: false, orders: [], error: 'Impossible de charger les commandes.' }))
        );
      })
    );
  }

  getStatusClass(status: string): string {
    return 'status-' + status.toLowerCase();
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING':   '⏳ En attente',
      'CONFIRMED': '✅ Confirmée',
      'PAID':      '💳 Payée',
      'SHIPPED':   '🚚 Expédiée',
      'DELIVERED': '📬 Livrée',
      'CANCELLED': '✕ Annulée',
    };
    return labels[status] ?? status;
  }

  getIcon(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('iphone') || n.includes('samsung') || n.includes('phone')) return '📱';
    if (n.includes('macbook') || n.includes('laptop') || n.includes('dell')) return '💻';
    if (n.includes('ipad') || n.includes('tab')) return '📲';
    if (n.includes('airpod') || n.includes('sony') || n.includes('audio')) return '🎧';
    return '📦';
  }
}
