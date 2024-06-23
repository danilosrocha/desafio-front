import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private apiUrl = 'https://desafio.up.railway.app/api/products';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProduct(companyData: IProductPayload): Observable<any> {
    return this.http.post<any>(this.apiUrl, companyData);
  }

  updateProduct(id: string, companyData: IProductPayload): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, companyData);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

export interface IProductPayload {
  "corporateName": string,
  "companyName": string,
  "cnpj": string,
  "user": string
}
