import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../core/services/product.service';

interface AdminStats {
  total: number;
  categories: number;
  outOfStock: number;
  stockValue: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  template: `
    <div class="admin-page">

      <!-- Header -->
      <div class="admin-header">
        <div>
          <h1>🛠️ Admin <span class="accent">CloudMart</span></h1>
          <p class="subtitle">Gestion du catalogue produits</p>
        </div>
        <a routerLink="/" class="btn-back">← Retour boutique</a>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon">📦</span>
          <div>
            <div class="stat-val">{{ stats.total }}</div>
            <div class="stat-lbl">Produits</div>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🏷️</span>
          <div>
            <div class="stat-val">{{ stats.categories }}</div>
            <div class="stat-lbl">Catégories</div>
          </div>
        </div>
        <div class="stat-card" [class.danger]="stats.outOfStock > 0">
          <span class="stat-icon">⚠️</span>
          <div>
            <div class="stat-val">{{ stats.outOfStock }}</div>
            <div class="stat-lbl">Ruptures</div>
          </div>
        </div>
        <div class="stat-card accent-card">
          <span class="stat-icon">💰</span>
          <div>
            <div class="stat-val">{{ stats.stockValue | currency:'EUR':'symbol':'1.0-0' }}</div>
            <div class="stat-lbl">Valeur stock</div>
          </div>
        </div>
      </div>

      <div class="main-grid">

        <!-- FORM -->
        <div class="form-panel">
          <div class="panel-title">
            {{ editingId ? '✏️ Modifier le produit' : '➕ Ajouter un produit' }}
          </div>

          <div class="field">
            <label>Nom *</label>
            <input [(ngModel)]="form.name" placeholder="Nom du produit"/>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Marque</label>
              <input [(ngModel)]="form.brand" placeholder="Marque"/>
            </div>
            <div class="field">
              <label>Catégorie *</label>
              <input [(ngModel)]="form.category" placeholder="Catégorie"/>
            </div>
          </div>
          <div class="field">
            <label>Description</label>
            <textarea [(ngModel)]="form.description" placeholder="Description..." rows="3"></textarea>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Prix (€) *</label>
              <input [(ngModel)]="form.price" type="number" min="0" step="0.01" placeholder="0.00"/>
            </div>
            <div class="field">
              <label>Stock *</label>
              <input [(ngModel)]="form.stock" type="number" min="0" placeholder="0"/>
            </div>
          </div>
          <div class="field">
            <label>Image URL</label>
            <input [(ngModel)]="form.imageUrl" placeholder="https://..."/>
          </div>

          @if (form.imageUrl) {
            <div class="img-preview">
              <img [src]="form.imageUrl" alt="preview" (error)="form.imageUrl = ''"/>
            </div>
          }

          @if (saveError) {
            <div class="alert-error">⚠️ {{ saveError }}</div>
          }
          @if (saveSuccess) {
            <div class="alert-success fade-in">✓ {{ saveSuccess }}</div>
          }

          <div class="form-actions">
            <button class="btn-primary" [disabled]="saving || !form.name || !form.category"
              (click)="save()">
              @if (saving) { <span class="spinner-sm"></span> }
              {{ editingId ? 'Enregistrer' : 'Ajouter' }}
            </button>
            @if (editingId) {
              <button class="btn-cancel" (click)="cancelEdit()">Annuler</button>
            }
          </div>
        </div>

        <!-- TABLE -->
        <div class="table-panel">
          <div class="table-header">
            <div class="panel-title" style="margin-bottom:0">
              📋 Catalogue
              <span class="count-badge">{{ products.length }}</span>
            </div>
            <input class="search-input" [(ngModel)]="searchTerm"
              placeholder="🔍  Rechercher..."/>
          </div>

          @if (loading) {
            <div class="table-loading">
              <div class="spinner-lg"></div>
              <p>Chargement...</p>
            </div>
          } @else {
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style="width:56px">Image</th>
                    <th>Nom</th>
                    <th>Catégorie</th>
                    <th style="text-align:right">Prix</th>
                    <th style="text-align:center">Stock</th>
                    <th style="width:120px; text-align:center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of filteredProducts; track p.id) {
                    <tr [class.editing-row]="editingId === p.id">
                      <td>
                        @if (p.imageUrl) {
                          <img [src]="p.imageUrl" [alt]="p.name" class="thumb"/>
                        } @else {
                          <div class="thumb-placeholder">📦</div>
                        }
                      </td>
                      <td>
                        <div class="prod-name">{{ p.name }}</div>
                        <div class="prod-brand">{{ p.brand }}</div>
                      </td>
                      <td><span class="cat-badge">{{ p.category }}</span></td>
                      <td style="text-align:right; font-weight:700; color:#00ff88">
                        {{ p.price | currency:'EUR':'symbol':'1.2-2' }}
                      </td>
                      <td style="text-align:center">
                        <span class="stock-chip" [class.zero]="p.stock === 0" [class.low]="p.stock > 0 && p.stock <= 5">
                          {{ p.stock }}
                        </span>
                      </td>
                      <td style="text-align:center">
                        <div class="action-btns">
                          <button class="btn-edit" (click)="editProduct(p)" title="Modifier">✏️</button>
                          <button class="btn-del"
                            (click)="deleteProduct(p.id)"
                            [disabled]="deletingId === p.id"
                            title="Supprimer">
                            @if (deletingId === p.id) { ⏳ } @else { 🗑️ }
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; background: #0a0a0f; min-height: 100vh; }

    .admin-page {
      max-width: 1400px; margin: 0 auto;
      padding: 2rem 1.5rem 4rem;
    }

    /* ─── Header ─── */
    .admin-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
    }

    .admin-header h1 {
      font-size: 1.8rem; font-weight: 900; color: #fff; letter-spacing: -0.03em;
    }

    .accent { color: #00ff88; }

    .subtitle { color: rgba(255,255,255,0.45); font-size: 0.85rem; margin-top: 0.2rem; }

    .btn-back {
      padding: 0.5rem 1.2rem;
      background: rgba(255,255,255,0.06);
      border: 1px solid #1e1e3a;
      color: rgba(255,255,255,0.7);
      border-radius: 8px; text-decoration: none;
      font-size: 0.85rem; font-weight: 500;
      transition: all 0.2s;
    }
    .btn-back:hover { background: rgba(255,255,255,0.12); color: #fff; }

    /* ─── Stats ─── */
    .stats-grid {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 1rem; margin-bottom: 2rem;
    }

    @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

    .stat-card {
      background: #0f0f1e; border: 1px solid #1e1e3a;
      border-radius: 12px; padding: 1.2rem 1.4rem;
      display: flex; align-items: center; gap: 1rem;
      transition: border-color 0.2s;
    }
    .stat-card:hover { border-color: rgba(0,255,136,0.3); }
    .stat-card.danger { border-color: rgba(255,68,68,0.4); }
    .stat-card.accent-card { border-color: rgba(0,255,136,0.3); background: rgba(0,255,136,0.04); }

    .stat-icon { font-size: 1.8rem; }
    .stat-val { font-size: 1.6rem; font-weight: 900; color: #fff; letter-spacing: -0.03em; }
    .accent-card .stat-val { color: #00ff88; }
    .stat-lbl { font-size: 0.72rem; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 0.1rem; }

    /* ─── Main grid ─── */
    .main-grid {
      display: grid; grid-template-columns: 360px 1fr;
      gap: 1.5rem; align-items: start;
    }

    @media (max-width: 1100px) { .main-grid { grid-template-columns: 1fr; } }

    .panel-title {
      font-size: 0.8rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.1em; color: rgba(255,255,255,0.5);
      margin-bottom: 1.4rem;
      display: flex; align-items: center; gap: 0.6rem;
    }

    /* ─── Form ─── */
    .form-panel {
      background: #0f0f1e; border: 1px solid #1e1e3a;
      border-radius: 14px; padding: 1.5rem;
      position: sticky; top: 1rem;
    }

    .field { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; min-width: 0; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; min-width: 0; overflow: hidden; }

    .field label {
      font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.4);
      text-transform: uppercase; letter-spacing: 0.08em;
    }

    .field input, .field textarea {
      width: 100%; box-sizing: border-box;
      background: #16162a; border: 1.5px solid #1e1e3a;
      border-radius: 8px; color: #fff; font-size: 0.88rem;
      font-family: inherit; padding: 0.65rem 0.9rem; outline: none;
      transition: border-color 0.2s; min-width: 0;
    }

    .field input:focus, .field textarea:focus { border-color: #00ff88; }
    .field input::placeholder, .field textarea::placeholder { color: rgba(255,255,255,0.2); }
    .field textarea { resize: vertical; }

    .img-preview {
      margin-bottom: 1rem; border-radius: 8px; overflow: hidden;
      background: #16162a; border: 1px solid #1e1e3a;
      height: 100px; display: flex; align-items: center; justify-content: center;
    }
    .img-preview img { max-height: 100%; max-width: 100%; object-fit: contain; }

    .alert-error {
      background: rgba(255,68,68,0.12); border: 1px solid rgba(255,68,68,0.4);
      color: #ff6b6b; padding: 0.65rem 0.9rem; border-radius: 8px;
      font-size: 0.82rem; margin-bottom: 1rem;
    }
    .alert-success {
      background: rgba(0,255,136,0.08); border: 1px solid rgba(0,255,136,0.3);
      color: #00ff88; padding: 0.65rem 0.9rem; border-radius: 8px;
      font-size: 0.82rem; margin-bottom: 1rem;
    }

    .form-actions { display: flex; gap: 0.8rem; margin-top: 0.5rem; }

    .btn-primary {
      flex: 1; padding: 0.7rem 1rem;
      background: linear-gradient(135deg, #00c870, #00ff88);
      color: #000; font-weight: 800; font-size: 0.9rem;
      border: none; border-radius: 8px; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      transition: all 0.2s; font-family: inherit;
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,255,136,0.35); }
    .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

    .btn-cancel {
      padding: 0.7rem 1.2rem;
      background: rgba(255,255,255,0.06); border: 1px solid #1e1e3a;
      color: rgba(255,255,255,0.6); border-radius: 8px; cursor: pointer;
      font-size: 0.88rem; font-family: inherit; transition: all 0.2s;
    }
    .btn-cancel:hover { background: rgba(255,255,255,0.12); color: #fff; }

    /* ─── Table ─── */
    .table-panel {
      background: #0f0f1e; border: 1px solid #1e1e3a;
      border-radius: 14px; overflow: hidden;
    }

    .table-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.2rem 1.5rem; border-bottom: 1px solid #1e1e3a;
      flex-wrap: wrap; gap: 0.8rem;
    }

    .count-badge {
      background: rgba(0,255,136,0.12); color: #00ff88;
      border: 1px solid rgba(0,255,136,0.3);
      padding: 0.15rem 0.6rem; border-radius: 999px;
      font-size: 0.72rem; font-weight: 700;
    }

    .search-input {
      background: #16162a; border: 1.5px solid #1e1e3a;
      border-radius: 8px; color: #fff; font-size: 0.85rem;
      padding: 0.5rem 0.9rem; outline: none; font-family: inherit;
      transition: border-color 0.2s; width: 220px;
    }
    .search-input:focus { border-color: #00ff88; }
    .search-input::placeholder { color: rgba(255,255,255,0.25); }

    .table-loading {
      display: flex; flex-direction: column; align-items: center;
      gap: 1rem; padding: 4rem; color: rgba(255,255,255,0.4);
    }

    .table-wrap { overflow-x: auto; max-height: 620px; overflow-y: auto; }

    table { width: 100%; border-collapse: collapse; }

    thead th {
      padding: 0.75rem 1rem;
      font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.1em; color: rgba(255,255,255,0.35);
      background: #0a0a1a; border-bottom: 1px solid #1e1e3a;
      white-space: nowrap; position: sticky; top: 0; z-index: 1;
    }

    tbody tr {
      border-bottom: 1px solid rgba(30,30,58,0.6);
      transition: background 0.15s;
    }
    tbody tr:hover { background: rgba(255,255,255,0.03); }
    tbody tr:last-child { border-bottom: none; }
    tbody tr.editing-row { background: rgba(0,255,136,0.04); border-left: 2px solid #00ff88; }

    td { padding: 0.7rem 1rem; vertical-align: middle; }

    .thumb {
      width: 44px; height: 44px; border-radius: 6px;
      object-fit: contain; background: #16162a;
    }
    .thumb-placeholder {
      width: 44px; height: 44px; border-radius: 6px;
      background: #16162a; display: flex; align-items: center;
      justify-content: center; font-size: 1.3rem;
    }

    .prod-name { font-size: 0.88rem; font-weight: 600; color: #fff; }
    .prod-brand { font-size: 0.72rem; color: rgba(255,255,255,0.4); margin-top: 0.1rem; }

    .cat-badge {
      background: rgba(51,85,238,0.15); border: 1px solid rgba(51,85,238,0.3);
      color: #7b96ff; padding: 0.2rem 0.6rem; border-radius: 999px;
      font-size: 0.68rem; font-weight: 600; white-space: nowrap;
    }

    .stock-chip {
      display: inline-block; padding: 0.2rem 0.6rem;
      border-radius: 999px; font-size: 0.78rem; font-weight: 700;
      background: rgba(0,255,136,0.1); color: #00ff88;
      border: 1px solid rgba(0,255,136,0.25);
    }
    .stock-chip.low { background: rgba(255,170,0,0.1); color: #ffaa00; border-color: rgba(255,170,0,0.3); }
    .stock-chip.zero { background: rgba(255,68,68,0.1); color: #ff4444; border-color: rgba(255,68,68,0.3); }

    .action-btns { display: flex; gap: 0.4rem; justify-content: center; }

    .btn-edit, .btn-del {
      width: 32px; height: 32px; border-radius: 6px;
      border: 1px solid #1e1e3a; background: rgba(255,255,255,0.04);
      cursor: pointer; font-size: 0.9rem;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .btn-edit:hover { background: rgba(0,255,136,0.12); border-color: rgba(0,255,136,0.4); }
    .btn-del:hover { background: rgba(255,68,68,0.12); border-color: rgba(255,68,68,0.4); }
    .btn-del:disabled { opacity: 0.4; cursor: not-allowed; }

    /* ─── Spinners ─── */
    .spinner-sm {
      width: 14px; height: 14px; border: 2px solid rgba(0,0,0,0.3);
      border-top-color: #000; border-radius: 50%;
      animation: spin 0.6s linear infinite; display: inline-block;
    }
    .spinner-lg {
      width: 40px; height: 40px; border: 3px solid rgba(0,255,136,0.15);
      border-top-color: #00ff88; border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .fade-in { animation: fadeIn 0.3s ease both; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class AdminComponent implements OnInit {

  products: Product[] = [];
  loading = false;
  saving = false;
  deletingId = '';
  editingId = '';
  searchTerm = '';
  saveError = '';
  saveSuccess = '';

  form: Partial<Product> = this.emptyForm();

  stats: AdminStats = { total: 0, categories: 0, outOfStock: 0, stockValue: 0 };

  constructor(private productService: ProductService) {}

  ngOnInit(): void { this.loadProducts(); }

  private emptyForm(): Partial<Product> {
    return { name: '', brand: '', category: '', description: '', price: undefined, stock: undefined, imageUrl: '' };
  }

  get filteredProducts(): Product[] {
    const t = this.searchTerm.toLowerCase();
    if (!t) return this.products;
    return this.products.filter(p =>
      p.name.toLowerCase().includes(t) ||
      p.category.toLowerCase().includes(t) ||
      (p.brand ?? '').toLowerCase().includes(t)
    );
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.computeStats();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private computeStats(): void {
    const cats = new Set(this.products.map(p => p.category));
    this.stats = {
      total: this.products.length,
      categories: cats.size,
      outOfStock: this.products.filter(p => p.stock === 0).length,
      stockValue: this.products.reduce((s, p) => s + (p.price * p.stock), 0)
    };
  }

  editProduct(p: Product): void {
    this.editingId = p.id;
    this.form = { ...p };
    this.saveError = '';
    this.saveSuccess = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingId = '';
    this.form = this.emptyForm();
    this.saveError = '';
  }

  save(): void {
    if (!this.form.name || !this.form.category) return;
    this.saving = true;
    this.saveError = '';
    this.saveSuccess = '';

    const payload: Product = {
      id: this.editingId || '',
      name: this.form.name!,
      brand: this.form.brand || '',
      category: this.form.category!,
      description: this.form.description || '',
      price: Number(this.form.price) || 0,
      stock: Number(this.form.stock) || 0,
      imageUrl: this.form.imageUrl || ''
    };

    const op$ = this.editingId
      ? this.productService.update(this.editingId, payload)
      : this.productService.create(payload);

    op$.subscribe({
      next: () => {
        this.saving = false;
        this.saveSuccess = this.editingId ? 'Produit mis à jour !' : 'Produit ajouté !';
        this.editingId = '';
        this.form = this.emptyForm();
        this.loadProducts();
        setTimeout(() => this.saveSuccess = '', 3000);
      },
      error: (err) => {
        this.saving = false;
        this.saveError = err.error?.message || 'Erreur lors de la sauvegarde';
      }
    });
  }

  deleteProduct(id: string): void {
    if (!confirm('Supprimer ce produit définitivement ?')) return;
    this.deletingId = id;
    this.productService.delete(id).subscribe({
      next: () => {
        this.deletingId = '';
        this.products = this.products.filter(p => p.id !== id);
        this.computeStats();
      },
      error: () => { this.deletingId = ''; }
    });
  }
}
