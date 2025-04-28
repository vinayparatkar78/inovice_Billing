import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:7059/api/Users';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  constructor(private http: HttpClient) {}

  adminRegister(data: any): Observable<any> {
    return this.http.post(`${BASE_URL}/AdminRegister`, data);
  }

  adminLogin(data: any): Observable<any> {
    return this.http.post(`${BASE_URL}/AdminLogin`, data);
  }

  assignRole(userId: string, role: string) {
    const url = `http://localhost:7059/api/Users/AssignRole?userId=${userId}&role=${role}`;
    return this.http.post(url, {});
  }
  
}
