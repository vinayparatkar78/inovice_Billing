import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminAuthService } from '../services/admin-auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-role-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './admin-role-management.component.html',
})
export class AdminRoleManagementComponent {
  form: FormGroup;
  roles = ['Customer', 'Admin', 'Manager'];

  constructor(private fb: FormBuilder, private authService: AdminAuthService) {
    this.form = this.fb.group({
      userId: ['', Validators.required],
      role: ['Customer', Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
      const { userId, role } = this.form.value;

      this.authService.assignRole(userId, role).subscribe({
        next: res => {
          alert(`✅ Role "${role}" assigned successfully!`);
        },
        error: err => {
          console.error('❌ Role assignment failed:', err);
          alert('Error assigning role: ' + err.error?.message || 'Server error');
        }
      });
    }
  }
}
