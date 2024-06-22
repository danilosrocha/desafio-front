import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CompanyService {
  private apiUrl = 'https://desafio.up.railway.app/api/companies';

  constructor(private http: HttpClient) { }

  getAllCompanies(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCompanyById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createCompany(companyData: ICompanyPayload): Observable<any> {
    return this.http.post<any>(this.apiUrl, companyData);
  }

  updateCompany(id: string, companyData: ICompanyPayload): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, companyData);
  }

  deleteCompany(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

export interface ICompanyPayload {
  "corporateName": string,
  "companyName": string,
  "cnpj": string,
  "user": string
}
