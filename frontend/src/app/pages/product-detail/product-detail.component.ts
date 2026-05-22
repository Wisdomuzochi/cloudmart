import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../core/services/product.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { Observable, switchMap, of, startWith, catchError, map } from 'rxjs';

interface DetailState {
  loading: boolean;
  product: Product | null;
  error: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink],
  template: `
    @if (state$ | async; as state) {
      @if (state.loading) {
        <div class="loading-screen">
          <div class="spinner-big"></div>
          <p>Chargement du produit...</p>
        </div>
      } @else if (state.error) {
        <div class="error-screen">
          <span>😕</span>
          <h2>Produit introuvable</h2>
          <p>{{ state.error }}</p>
          <a routerLink="/" class="btn btn-primary">← Retour au catalogue</a>
        </div>
      } @else if (state.product; as p) {
        <div class="detail-page fade-in">

          <!-- Breadcrumb -->
          <nav class="breadcrumb">
            <a routerLink="/">Catalogue</a>
            <span>›</span>
            <span class="bc-cat">{{ p.category }}</span>
            <span>›</span>
            <span class="bc-current">{{ p.name }}</span>
          </nav>

          <div class="detail-grid">

            <!-- Left: visual -->
            <div class="product-visual">
              <div class="visual-card">
                <div class="cat-badge">{{ p.category }}</div>
                @if (p.imageUrl && !imgError) {
                  <img [src]="p.imageUrl" [alt]="p.name" class="product-img"
                       (error)="imgError = true"/>
                } @else {
                  <div class="big-icon">{{ getCategoryIcon(p.category) }}</div>
                }
                <div class="brand-chip">{{ p.brand }}</div>
              </div>
            </div>

            <!-- Right: info -->
            <div class="product-info">
              <div class="info-top">
                <h1 class="product-name">{{ p.name }}</h1>
                <button
                  class="fav-toggle"
                  (click)="toggleFav(p)"
                  [class.is-fav]="isFav"
                  [title]="isFav ? 'Retirer des favoris' : 'Sauvegarder dans les favoris'"
                >
                  {{ isFav ? '❤️' : '🤍' }}
                  {{ isFav ? 'Dans vos favoris' : 'Ajouter aux favoris' }}
                </button>
              </div>

              <p class="product-desc">{{ p.description }}</p>

              <div class="price-block">
                <span class="big-price">{{ p.price | currency:'EUR':'symbol':'1.2-2' }}</span>
                <span class="price-note">TTC · livraison offerte dès 50€</span>
              </div>

              <div class="stock-line" [class.out]="p.stock === 0">
                @if (p.stock > 0) {
                  <span class="dot green"></span>
                  <span>{{ p.stock > 10 ? 'En stock' : p.stock + ' articles restants — commandez vite !' }}</span>
                } @else {
                  <span class="dot red"></span>
                  <span>Rupture de stock</span>
                }
              </div>

              <div class="cta-row">
                <button
                  class="btn btn-primary cta-btn"
                  (click)="addToCart(p)"
                  [disabled]="p.stock === 0"
                  [class.added]="cartAdded"
                >
                  @if (cartAdded) {
                    ✓ Ajouté au panier
                  } @else {
                    🛒 Ajouter au panier
                  }
                </button>
                <a routerLink="/" class="btn btn-back">← Retour</a>
              </div>

              @if (cartMessage) {
                <div class="toast-inline fade-in">✅ {{ cartMessage }}</div>
              }

              <!-- Specs -->
              <div class="specs-card">
                <div class="specs-title">Caractéristiques</div>
                <div class="spec-row">
                  <span class="spec-label">Marque</span>
                  <span class="spec-value">{{ p.brand }}</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Catégorie</span>
                  <span class="spec-value">{{ p.category }}</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Référence</span>
                  <span class="spec-value spec-id">{{ p.id | slice:0:12 }}…</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Disponibilité</span>
                  <span class="spec-value" [class.text-green]="p.stock > 0" [class.text-red]="p.stock === 0">
                    {{ p.stock > 0 ? 'Disponible' : 'Indisponible' }}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      }
    }
  `,
  styles: [`
    /* ─── Loading / Error ─── */
    .loading-screen, .error-screen {
      min-height: calc(100vh - 64px);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 1rem; text-align: center;
      color: var(--muted);
    }

    .spinner-big {
      width: 48px; height: 48px;
      border: 3px solid var(--border);
      border-top-color: var(--green);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .error-screen span { font-size: 3rem; }
    .error-screen h2 { font-size: 1.5rem; color: var(--text); }

    /* ─── Page ─── */
    .detail-page {
      max-width: 1000px;
      margin: 0 auto;
      padding: 1.5rem 1.5rem 3rem;
    }

    /* Breadcrumb */
    .breadcrumb {
      display: flex; align-items: center; gap: 0.5rem;
      font-size: 0.82rem; color: var(--muted); margin-bottom: 2rem;
    }

    .breadcrumb a { color: var(--blue); text-decoration: none; }
    .breadcrumb a:hover { color: var(--green); }
    .bc-cat { color: var(--muted); }
    .bc-current { color: var(--text); font-weight: 500; }

    /* Grid */
    .detail-grid {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 2.5rem;
      align-items: start;
    }

    @media (max-width: 768px) {
      .detail-grid { grid-template-columns: 1fr; }
    }

    /* ─── Visual ─── */
    .visual-card {
      background: linear-gradient(145deg, var(--surface) 0%, var(--surface2) 100%);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 2.5rem;
      display: flex; flex-direction: column;
      align-items: center; gap: 1.2rem;
      position: sticky; top: 80px;
    }

    .cat-badge {
      font-size: 0.68rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.12em;
      color: var(--blue); background: var(--blue-dim);
      padding: 0.25rem 0.75rem; border-radius: 999px;
      border: 1px solid rgba(85,102,255,0.3);
    }

    .product-img {
      width: 100%; max-height: 260px;
      object-fit: contain;
      border-radius: var(--radius-sm);
      transition: transform 0.3s ease;
    }

    .product-img:hover { transform: scale(1.04); }

    .big-icon {
      font-size: 7rem;
      filter: drop-shadow(0 8px 24px rgba(0,0,0,0.4));
      line-height: 1;
    }

    .brand-chip {
      padding: 0.4rem 1.2rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 999px;
      font-size: 0.85rem; font-weight: 600;
      color: var(--muted);
    }

    /* ─── Info ─── */
    .product-info { display: flex; flex-direction: column; gap: 1.4rem; }

    .info-top {
      display: flex; align-items: flex-start;
      justify-content: space-between; gap: 1rem;
      flex-wrap: wrap;
    }

    .product-name {
      font-size: 1.9rem; font-weight: 800;
      letter-spacing: -0.04em; color: var(--text);
      line-height: 1.2; flex: 1;
    }

    .fav-toggle {
      display: flex; align-items: center; gap: 0.4rem;
      background: var(--surface);
      border: 1.5px solid var(--border);
      color: var(--muted);
      padding: 0.5rem 1rem;
      border-radius: 999px;
      cursor: pointer;
      font-size: 0.82rem; font-weight: 600;
      font-family: inherit;
      transition: var(--transition);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .fav-toggle:hover { border-color: var(--red); color: var(--red); }
    .fav-toggle.is-fav { border-color: var(--red); color: var(--red); background: var(--red-dim); }

    .product-desc { color: var(--muted); font-size: 0.95rem; line-height: 1.7; }

    /* Price */
    .price-block { display: flex; flex-direction: column; gap: 0.2rem; }

    .big-price {
      font-size: 2.5rem; font-weight: 900;
      color: var(--green); letter-spacing: -0.04em;
    }

    .price-note { font-size: 0.78rem; color: var(--muted); }

    /* Stock */
    .stock-line {
      display: flex; align-items: center; gap: 0.5rem;
      font-size: 0.85rem; color: var(--green); font-weight: 500;
    }

    .stock-line.out { color: var(--red); }

    .dot {
      width: 8px; height: 8px; border-radius: 50%;
      flex-shrink: 0;
    }

    .dot.green { background: var(--green); box-shadow: 0 0 6px var(--green); }
    .dot.red   { background: var(--red);   box-shadow: 0 0 6px var(--red); }

    /* CTA */
    .cta-row { display: flex; gap: 0.8rem; flex-wrap: wrap; }

    .cta-btn {
      flex: 1; min-width: 200px;
      padding: 0.95rem; font-size: 1rem;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    }

    .cta-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

    .cta-btn.added {
      background: linear-gradient(135deg, #00cc6a, var(--green));
    }

    .btn-back {
      padding: 0.95rem 1.4rem;
      background: var(--surface);
      border: 1.5px solid var(--border);
      color: var(--muted);
      border-radius: var(--radius-sm);
      text-decoration: none;
      font-size: 0.9rem; font-weight: 600;
      transition: var(--transition);
      white-space: nowrap;
    }

    .btn-back:hover { border-color: var(--text); color: var(--text); }

    .toast-inline {
      background: var(--green-dim);
      border: 1px solid var(--green);
      color: var(--green);
      padding: 0.6rem 1rem;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
    }

    /* Specs */
    .specs-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
    }

    .specs-title {
      padding: 0.8rem 1.2rem;
      font-size: 0.75rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.1em;
      color: var(--muted);
      border-bottom: 1px solid var(--border);
    }

    .spec-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.7rem 1.2rem;
      border-bottom: 1px solid var(--border);
    }

    .spec-row:last-child { border-bottom: none; }

    .spec-label { font-size: 0.82rem; color: var(--muted); }
    .spec-value { font-size: 0.88rem; font-weight: 600; color: var(--text); }
    .spec-id { font-family: monospace; font-size: 0.78rem; color: var(--muted); }

    .text-green { color: var(--green) !important; }
    .text-red   { color: var(--red) !important; }
  `]
})
export class ProductDetailComponent {

  state$: Observable<DetailState>;
  cartMessage = '';
  cartAdded = false;
  isFav = false;
  imgError = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private favoritesService: FavoritesService
  ) {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.state$ = this.productService.getById(id).pipe(
      map(product => {
        this.isFav = this.favoritesService.isFavorite(product.id);
        return { loading: false, product, error: '' };
      }),
      startWith({ loading: true, product: null, error: '' }),
      catchError(() => of({ loading: false, product: null, error: 'Produit introuvable' }))
    );
  }

  getCategoryIcon(cat: string): string {
    const icons: Record<string, string> = {
      'beauty': '💄', 'fragrances': '🌸', 'furniture': '🪑',
      'groceries': '🥦', 'home-decoration': '🏡', 'kitchen-accessories': '🍳',
      'laptops': '💻', 'mens-shirts': '👔', 'mens-shoes': '👟',
      'mens-watches': '⌚', 'mobile-accessories': '📱',
      'motorcycle': '🏍️', 'skin-care': '🧴', 'smartphones': '📱',
      'sports-accessories': '⚽', 'sunglasses': '🕶️', 'tablets': '📲',
      'tops': '👕', 'vehicle': '🚗', 'womens-bags': '👜',
      'womens-dresses': '👗', 'womens-jewellery': '💍', 'womens-shoes': '👠',
      'womens-watches': '⌚',
      'Smartphones': '📱', 'Laptops': '💻', 'Audio': '🎧',
      'Tablettes': '📲', 'Accessoires': '⌨️', 'Gaming': '🎮', 'TV': '📺',
    };
    return icons[cat] ?? '🛍️';
  }

  toggleFav(product: Product): void {
    this.favoritesService.toggle(product);
    this.isFav = this.favoritesService.isFavorite(product.id);
  }

  addToCart(product: Product): void {
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const existing = cart.find((i: any) => i.productId === product.id);
    if (existing) existing.quantity++;
    else cart.push({ productId: product.id, productName: product.name, quantity: 1, unitPrice: product.price, imageUrl: product.imageUrl || '' });
    sessionStorage.setItem('cart', JSON.stringify(cart));
    this.cartAdded = true;
    this.cartMessage = `${product.name} ajouté au panier !`;
    setTimeout(() => { this.cartAdded = false; this.cartMessage = ''; }, 2500);
  }
}
