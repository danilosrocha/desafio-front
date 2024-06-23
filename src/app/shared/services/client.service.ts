import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ClientService {
  private apiUrl = 'https://desafio.up.railway.app/api/customers';

  constructor(private http: HttpClient) { }

  getAllClients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getClientById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createClient(clientData: IClientPayload): Observable<any> {
    return this.http.post<any>(this.apiUrl, clientData);
  }

  updateClient(id: string, clientData: IClientPayload): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, clientData);
  }

  deleteClient(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

export interface IClientPayload {
  "name": string,
  "email": string,
  "telephone": string,
  "company": string
}