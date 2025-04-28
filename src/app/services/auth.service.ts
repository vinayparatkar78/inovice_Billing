import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE = 'http://localhost:7059/api/Users';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${API_BASE}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${API_BASE}/login`, data);
  }
}
