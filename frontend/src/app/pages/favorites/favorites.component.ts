import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../core/services/favorites.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink, ProductCardComponent],
  template: `
    <div class="favs-page">
      <div class="page-header fade-up">
        <div class="header-left">
          <h1>❤️ Mes favoris</h1>
          <p>{{ (favoritesService.favorites$ | async)?.length || 0 }} article(s) sauvegardé(s)</p>
        </div>
        <a routerLink="/" class="btn btn-secondary">← Continuer mes achats</a>
      </div>

      @if (favoritesService.favorites$ | async; as favs) {
        @if (favs.length === 0) {
          <div class="empty-state fade-up">
            <div class="empty-icon">🤍</div>
            <h2>Aucun favori pour l'instant</h2>
            <p>Cliquez sur le cœur 🤍 d'un produit pour le retrouver ici.</p>
            <a routerLink="/" class="btn btn-primary">Découvrir le catalogue</a>
          </div>
        } @else {
          <div class="favs-grid fade-up">
            @for (product of favs; track product.id) {
              <app-product-card
                [product]="product"
                (addToCart)="onAddToCart($event)"
              />
            }
          </div>

          @if (cartMessage) {
            <div class="toast-global fade-in">✅ {{ cartMessage }}</div>
          }
        }
      }
    </div>
  `,
  styles: [`
    .favs-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem 3rem;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .header-left h1 {
      font-size: 1.8rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--text);
    }

    .header-left p { color: var(--muted); font-size: 0.9rem; margin-top: 0.2rem; }

    .empty-state {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 1rem; padding: 6rem 2rem; text-align: center;
    }

    .empty-icon { font-size: 4rem; }

    .empty-state h2 { font-size: 1.4rem; color: var(--text); }
    .empty-state p { color: var(--muted); font-size: 0.95rem; max-width: 380px; }

    .favs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .toast-global {
      position: fixed;
      bottom: 2rem; right: 2rem;
      background: var(--green-dim);
      border: 1px solid var(--green);
      color: var(--green);
      padding: 0.8rem 1.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.9rem; font-weight: 600;
      z-index: 500;
    }
  `]
})
export class FavoritesComponent {
  cartMessage = '';

  constructor(public favoritesService: FavoritesService) {}

  onAddToCart(product: any): void {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((i: any) => i.productId === product.id);
    if (existing) existing.quantity++;
    else cart.push({ productId: product.id, productName: product.name, quantity: 1, unitPrice: product.price });
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartMessage = `${product.name} ajouté au panier`;
    setTimeout(() => this.cartMessage = '', 2000);
  }
}
