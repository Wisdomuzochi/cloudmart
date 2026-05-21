import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  userId: number;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface OrderRequest {
  userId: number;
  userEmail: string;
  items: OrderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8090/api/orders';

  constructor(private http: HttpClient) {}

  createOrder(request: OrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, request);
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }
}