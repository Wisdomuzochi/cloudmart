import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/services/product.service';
import { FavoritesService } from '../../core/services/favorites.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card" [class.out-of-stock]="product.stock === 0">

      <!-- Top: category + fav button -->
      <div class="card-top">
        <span class="category-badge">{{ product.category }}</span>
        <button
          class="fav-btn"
          (click)="toggleFav($event)"
          [class.is-fav]="isFav"
          [title]="isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        >
          {{ isFav ? '❤️' : '🤍' }}
        </button>
      </div>

      <!-- Icon -->
      <div class="card-img-area">
        <div class="product-icon">{{ getCategoryIcon(product.category) }}</div>
      </div>

      <!-- Body -->
      <div class="card-body">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="brand">{{ product.brand }}</p>
        <p class="description">{{ product.description }}</p>
      </div>

      <!-- Footer -->
      <div class="card-footer">
        <div class="price-row">
          <span class="price">{{ product.price | currency:'EUR':'symbol':'1.0-0' }}</span>
          @if (product.stock > 0 && product.stock <= 10) {
            <span class="low-stock">⚡ {{ product.stock }} restants</span>
          } @else if (product.stock > 10) {
            <span class="stock-ok">{{ product.stock }} en stock</span>
          } @else {
            <span class="stock-empty">Rupture</span>
          }
        </div>
        <div class="actions">
          <a [routerLink]="['/products', product.id]" class="btn-voir">Voir →</a>
          <button
            class="btn-cart"
            (click)="handleAddToCart()"
            [disabled]="product.stock === 0"
            [class.added]="justAdded"
          >
            {{ justAdded ? '✓ Ajouté' : '+ Panier' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      display: flex;
      flex-direction: column;
      transition: transform 0.25s cubic-bezier(0.4,0,0.2,1),
                  border-color 0.25s ease,
                  box-shadow 0.25s ease;
    }

    .card:hover {
      transform: translateY(-4px);
      border-color: rgba(85,102,255,0.4);
      box-shadow: 0 12px 40px rgba(0,0,0,0.4);
    }

    .card.out-of-stock { opacity: 0.55; }

    /* Top row */
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.85rem 1rem 0;
    }

    .category-badge {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--blue);
      background: var(--blue-dim);
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      border: 1px solid rgba(85,102,255,0.25);
    }

    .fav-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.1rem;
      line-height: 1;
      padding: 0.2rem;
      border-radius: 50%;
      transition: transform 0.2s ease;
      width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
    }

    .fav-btn:hover { transform: scale(1.25); }
    .fav-btn:active { transform: scale(0.9); }

    /* Icon area */
    .card-img-area {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      height: 88px;
    }

    .product-icon {
      font-size: 3rem;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
      transition: transform 0.3s ease;
    }

    .card:hover .product-icon { transform: scale(1.1) rotate(-4deg); }

    /* Body */
    .card-body {
      padding: 0 1rem 0.8rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .product-name { font-size: 0.95rem; font-weight: 700; color: var(--text); line-height: 1.3; }
    .brand { font-size: 0.78rem; color: var(--muted); font-weight: 500; }

    .description {
      font-size: 0.78rem;
      color: var(--muted);
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 1.5;
    }

    /* Footer */
    .card-footer {
      padding: 0.8rem 1rem 1rem;
      border-top: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
    }

    .price-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .price { font-size: 1.3rem; font-weight: 800; color: var(--green); letter-spacing: -0.02em; }
    .stock-ok { font-size: 0.72rem; color: var(--green); font-weight: 600; }
    .stock-empty { font-size: 0.72rem; color: var(--red); font-weight: 600; }
    .low-stock { font-size: 0.72rem; color: var(--gold); font-weight: 600; }

    /* Actions */
    .actions {
      display: flex;
      gap: 0.5rem;
      align-items: stretch;
    }

    .btn-voir {
      flex-shrink: 0;
      white-space: nowrap;
      padding: 0.5rem 0.95rem;
      background: transparent;
      border: 1.5px solid var(--border);
      color: var(--text);
      border-radius: var(--radius-sm);
      font-size: 0.82rem;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      transition: var(--transition);
      cursor: pointer;
    }

    .btn-voir:hover {
      border-color: var(--blue);
      color: var(--blue);
      background: var(--blue-dim);
    }

    .btn-cart {
      flex: 1;
      position: relative;
      overflow: hidden;
      padding: 0.5rem 0.75rem;
      background: var(--green-dim);
      border: 1.5px solid var(--green);
      color: var(--green);
      border-radius: var(--radius-sm);
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s, color 0.2s, transform 0.12s, box-shadow 0.2s;
      font-family: inherit;
      white-space: nowrap;
    }

    .btn-cart:hover:not(:disabled) {
      background: var(--green);
      color: #000;
      box-shadow: 0 0 18px rgba(0,255,136,0.35);
    }

    .btn-cart:active:not(:disabled) { transform: scale(0.95); }

    .btn-cart.added {
      background: var(--green);
      color: #000;
    }

    .btn-cart:disabled { opacity: 0.35; cursor: not-allowed; }

    .btn-cart::after {
      content: '';
      position: absolute;
      width: 150px; height: 150px;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) scale(0);
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      pointer-events: none;
    }

    .btn-cart:active:not(:disabled)::after {
      animation: ripple 0.4s ease-out;
    }

    @keyframes ripple {
      to { transform: translate(-50%, -50%) scale(3); opacity: 0; }
    }
  `]
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  justAdded = false;
  isFav = false;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.isFav = this.favoritesService.isFavorite(this.product.id);
  }

  getCategoryIcon(cat: string): string {
    const icons: Record<string, string> = {
      'Smartphones': '📱', 'Laptops': '💻',
      'Audio': '🎧', 'Tablettes': '📲',
      'Accessoires': '⌨️', 'Gaming': '🎮', 'TV': '📺',
    };
    return icons[cat] ?? '📦';
  }

  toggleFav(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoritesService.toggle(this.product);
    this.isFav = this.favoritesService.isFavorite(this.product.id);
  }

  handleAddToCart(): void {
    if (this.product.stock === 0) return;
    this.addToCart.emit(this.product);
    this.justAdded = true;
    setTimeout(() => this.justAdded = false, 1800);
  }
}
