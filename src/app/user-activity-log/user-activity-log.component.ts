import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-activity-log',
  standalone: true,
  templateUrl: './user-activity-log.component.html',
  styleUrls: ['./user-activity-log.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class UserActivityLogComponent {
  userId: string = '';
  activityLogs: any[] = [];

  constructor(private http: HttpClient) {}

  getUserActivity() {
    if (!this.userId) return;

    this.http.get<any[]>(`http://localhost:7059/api/UserActivity/history/${this.userId}`)
      .subscribe({
        next: (data) => {
          console.log('API Response:', data);
          this.activityLogs = data;
        },
        error: (err) => {
          console.error('Error fetching user activity:', err);
        }
      });
  }

  logDummyActivity() {
    if (!this.userId) return;

    const dummyPayload = {
      activity: 'Visited Dashboard',
      description: 'User opened the admin dashboard'
    };

    this.http.post(`http://localhost:7059/api/UserActivity/log/${this.userId}`, dummyPayload)
      .subscribe({
        next: () => this.getUserActivity(),
        error: (err) => console.error(err)
      });
  }
}
