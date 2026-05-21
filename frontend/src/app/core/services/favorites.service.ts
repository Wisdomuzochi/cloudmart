import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {

  private KEY = 'cloudmart_favorites';
  private favs$ = new BehaviorSubject<Product[]>([]);

  favorites$ = this.favs$.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.KEY);
      if (saved) this.favs$.next(JSON.parse(saved));
    }
  }

  isFavorite(id: string): boolean {
    return this.favs$.value.some(p => p.id === id);
  }

  toggle(product: Product): void {
    const current = this.favs$.value;
    const updated = this.isFavorite(product.id)
      ? current.filter(p => p.id !== product.id)
      : [...current, product];
    this.favs$.next(updated);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.KEY, JSON.stringify(updated));
    }
  }

  getAll(): Product[] {
    return this.favs$.value;
  }

  count(): number {
    return this.favs$.value.length;
  }
}
