import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './audit-logs.component.html',
})
export class AuditLogsComponent {
  auditId = '';
  auditEmail = '';
  auditById: any;
  auditByEmail: any;

  constructor(private http: HttpClient) {}

  fetchByAuditId() {
    if (this.auditId) {
      const url = `http://localhost:7059/api/AuditLog/AuditId/${this.auditId}`;
      this.http.get(url).subscribe({
        next: data => this.auditById = data,
        error: err => alert('Error fetching by Audit ID: ' + err.message)
      });
    }
  }

  fetchByEmail() {
    if (this.auditEmail) {
      const url = `http://localhost:7059/api/AuditLog/user/${encodeURIComponent(this.auditEmail)}`;
      this.http.get(url).subscribe({
        next: data => this.auditByEmail = data,
        error: err => alert('Error fetching by Email: ' + err.message)
      });
    }
  }
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
  
}
