import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { AuditLogsComponent } from '../audit-logs/audit-logs.component';
import { UserActivityLogComponent } from '../user-activity-log/user-activity-log.component';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatTabsModule, AuditLogsComponent, UserActivityLogComponent],
  template: `
    <mat-tab-group>
      <mat-tab label="🔍 Audit Log">
        <app-audit-logs></app-audit-logs>
      </mat-tab>
      <mat-tab label="📊 Activity Log">
        <app-user-activity-log></app-user-activity-log>
      </mat-tab>
    </mat-tab-group>
  `
})
export class AdminDashboardComponent {}
