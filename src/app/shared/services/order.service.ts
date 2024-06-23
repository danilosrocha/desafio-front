import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  private apiUrl = 'https://desafio.up.railway.app/api/orders';

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getOrderById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createOrder(clientData: IOrderPayload): Observable<any> {
    return this.http.post<any>(this.apiUrl, clientData);
  }

  updateOrder(id: string, clientData: IOrderPayload): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, clientData);
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  concludeOrder(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/conclude/${id}`);
  }
}

export interface IOrderPayload {
  "number": string,
  "observation": string,
  "date": Date,
  "customer": string,
  "company": string
  "products": [
    {
      "product": string,
      "quantity": number
    }
  ],
}