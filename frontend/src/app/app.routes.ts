import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: '**', redirectTo: '' }
];
