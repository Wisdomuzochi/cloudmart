import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ProductService, Product } from '../../core/services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { Observable, catchError, map, of, startWith } from 'rxjs';

interface ProductsState {
  loading: boolean;
  products: Product[];
  error: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AsyncPipe, ProductCardComponent, FormsModule],
  template: `
    <div class="home-wrapper">

      <!-- Hero banner -->
      <div class="hero-banner">
        <div class="hero-inner">

          <div class="hero-cats fade-up">
            <span class="hcat">💄 Beauté</span>
            <span class="hcat">👗 Mode</span>
            <span class="hcat">💻 Tech</span>
            <span class="hcat">🪑 Maison</span>
            <span class="hcat">🍳 Cuisine</span>
            <span class="hcat">👟 Chaussures</span>
          </div>

          <div class="hero-text fade-up">
            <h1>Tout ce que vous aimez,<br><span class="hero-accent">au meilleur prix</span></h1>
            <p class="hero-sub">Mode, beauté, tech, déco & bien plus — livraison offerte dès 50€</p>
          </div>

          <div class="hero-badges fade-up">
            <span class="hb">🚚 Livraison 24h</span>
            <span class="hb">🔄 Retours 30j</span>
            <span class="hb">🛡️ Paiement sécurisé</span>
            <span class="hb">⭐ 4.9 / 5</span>
          </div>

        </div>
      </div>

      <!-- Catalogue -->
      <div class="home-content">
        <div class="toolbar">
          <div class="toolbar-left">
            <h2 class="section-title">Nos produits</h2>
            @if (allProducts.length > 0) {
              <span class="count-chip">{{ filteredProducts.length }} articles</span>
            }
          </div>
          <div class="filters">
            <div class="search-wrap">
              <span class="search-icon">🔍</span>
              <input
                [(ngModel)]="searchTerm"
                (ngModelChange)="onSearch()"
                placeholder="Rechercher..."
                class="search"
              />
            </div>
            <select [(ngModel)]="selectedCategory"
                    (ngModelChange)="onCategoryChange()"
                    class="select">
              <option value="">Toutes les catégories</option>
              @for (cat of categories; track cat) {
                <option [value]="cat">{{ cat }}</option>
              }
            </select>
          </div>
        </div>

        @if (state$ | async; as state) {
          @if (state.loading) {
            <div class="loading">
              <div class="loading-grid">
                @for (i of [1,2,3,4,5,6]; track i) {
                  <div class="skeleton-card"></div>
                }
              </div>
            </div>
          } @else if (state.error) {
            <div class="error">⚠️ {{ state.error }}</div>
          } @else if (filteredProducts.length === 0) {
            <div class="empty">
              <span>🔍</span>
              <p>Aucun produit trouvé pour « {{ searchTerm || selectedCategory }} »</p>
            </div>
          } @else {
            <div class="grid fade-up">
              @for (product of filteredProducts; track product.id) {
                <app-product-card
                  [product]="product"
                  (addToCart)="onAddToCart($event)"
                />
              }
            </div>
          }
        }
      </div>

    </div>

    @if (cartMessage) {
      <div class="toast fade-in">✅ {{ cartMessage }}</div>
    }
  `,
  styles: [`
    /* ─── Hero ─── */
    .hero-banner {
      background: linear-gradient(135deg, #0d0d20 0%, #111130 40%, #0a1a28 70%, #0d1f18 100%);
      margin: 0 -1.5rem;
      padding: 2.5rem 1.5rem 3rem;
      position: relative;
      overflow: hidden;
    }

    .hero-banner::before {
      content: '';
      position: absolute; inset: 0; pointer-events: none;
      background:
        radial-gradient(ellipse at 15% 60%, rgba(0,168,89,0.12) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 30%, rgba(51,85,238,0.10) 0%, transparent 55%),
        radial-gradient(ellipse at 50% 100%, rgba(0,168,89,0.06) 0%, transparent 50%);
    }

    .hero-inner {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      position: relative; z-index: 1;
    }

    /* Category pills */
    .hero-cats { display: flex; gap: 0.5rem; flex-wrap: wrap; }

    .hcat {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.14);
      color: rgba(255,255,255,0.75);
      padding: 0.3rem 0.9rem;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 500;
      backdrop-filter: blur(6px);
      transition: all 0.2s ease;
    }

    .hcat:hover {
      background: rgba(255,255,255,0.14);
      color: #fff;
      transform: translateY(-1px);
    }

    /* Title */
    .hero-text h1 {
      font-size: clamp(1.9rem, 4.5vw, 3rem);
      font-weight: 900;
      color: #fff;
      letter-spacing: -0.04em;
      line-height: 1.12;
    }

    .hero-accent {
      background: linear-gradient(90deg, var(--green) 0%, #00d4aa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-sub {
      color: rgba(255,255,255,0.58);
      font-size: 1rem;
      margin-top: 0.5rem;
      line-height: 1.5;
    }

    /* Badges */
    .hero-badges { display: flex; gap: 0.55rem; flex-wrap: wrap; }

    .hb {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.13);
      color: rgba(255,255,255,0.78);
      padding: 0.35rem 0.85rem;
      border-radius: 999px;
      font-size: 0.77rem;
      font-weight: 500;
      backdrop-filter: blur(4px);
    }

    /* ─── Content ─── */
    .home-content {
      max-width: 1200px;
      margin: 2rem auto 3rem;
      padding: 0;
    }

    /* Toolbar */
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .toolbar-left { display: flex; align-items: center; gap: 0.7rem; }

    .section-title {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--text);
      letter-spacing: -0.02em;
    }

    .count-chip {
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--muted);
      padding: 0.2rem 0.7rem;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 600;
      box-shadow: var(--shadow-sm);
    }

    .filters { display: flex; gap: 0.7rem; align-items: center; }

    .search-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 0.8rem;
      font-size: 0.85rem;
      pointer-events: none;
    }

    .search {
      padding: 0.6rem 1rem 0.6rem 2.4rem;
      background: var(--surface);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text);
      font-size: 0.88rem;
      font-family: inherit;
      outline: none;
      transition: var(--transition);
      box-shadow: var(--shadow-sm);
      width: 220px;
    }

    .search:focus {
      border-color: var(--blue);
      box-shadow: 0 0 0 3px var(--blue-dim);
      width: 280px;
    }

    .search::placeholder { color: #b0b5c3; }

    .select {
      padding: 0.6rem 1rem;
      background: var(--surface);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text);
      font-family: inherit;
      cursor: pointer;
      outline: none;
      font-size: 0.88rem;
      box-shadow: var(--shadow-sm);
      transition: var(--transition);
    }
    .select:focus { border-color: var(--blue); }

    /* Grid */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(252px, 1fr));
      gap: 1.1rem;
    }

    /* Skeleton loader */
    .loading-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(252px, 1fr));
      gap: 1.1rem;
    }

    .skeleton-card {
      height: 340px;
      border-radius: var(--radius);
      background: linear-gradient(90deg, var(--surface3) 25%, var(--surface) 50%, var(--surface3) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s ease infinite;
    }

    @keyframes shimmer {
      0%   { background-position: 200% center; }
      100% { background-position: -200% center; }
    }

    .empty {
      display: flex; flex-direction: column; align-items: center;
      gap: 0.8rem; padding: 5rem 2rem; text-align: center; color: var(--muted);
    }

    .empty span { font-size: 3rem; }

    .error {
      padding: 2rem; color: var(--red);
      background: var(--red-dim);
      border: 1px solid rgba(224,40,66,0.2);
      border-radius: var(--radius); text-align: center;
    }
    .toast {
      position: fixed;
      bottom: 2rem; right: 2rem;
      background: var(--surface);
      border: 1px solid rgba(0,168,89,0.3);
      color: var(--green-dark);
      padding: 0.8rem 1.4rem;
      border-radius: var(--radius-sm);
      font-size: 0.9rem; font-weight: 600;
      box-shadow: var(--shadow-lg);
      z-index: 500;
    }
  `]
})
export class HomeComponent {

  allProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory = '';
  searchTerm = '';
  cartMessage = '';
  state$!: Observable<ProductsState>;

  get filteredProducts(): Product[] {
    return this.allProducts.filter(p => {
      const matchName = p.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCat = !this.selectedCategory || p.category === this.selectedCategory;
      return matchName && matchCat;
    });
  }

  constructor(private productService: ProductService) {
    this.state$ = this.productService.getAll().pipe(
      map(products => {
        this.allProducts = products;
        this.categories = [...new Set(products.map(p => p.category))];
        return { loading: false, products, error: '' };
      }),
      startWith({ loading: true, products: [] as Product[], error: '' }),
      catchError(err => of({
        loading: false,
        products: [] as Product[],
        error: `Impossible de charger les produits (${err.status || err.message}). Vérifiez que le serveur est démarré.`
      }))
    );
  }

  onSearch(): void {}

  onCategoryChange(): void {}

  onAddToCart(product: Product): void {
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const existing = cart.find((i: any) => i.productId === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
        imageUrl: product.imageUrl || ''
      });
    }
    sessionStorage.setItem('cart', JSON.stringify(cart));
    this.cartMessage = `${product.name} ajouté au panier`;
    setTimeout(() => this.cartMessage = '', 2000);
  }
}
