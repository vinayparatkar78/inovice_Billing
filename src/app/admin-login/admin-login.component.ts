import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AdminAuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit(): void {
    console.log('🟡 Submit clicked');
    if (this.form.valid) {
      this.authService.adminLogin(this.form.value).subscribe({
        next: res => {
          console.log('✅ Admin logged in:', res);
          alert('Admin login successful!');
          this.router.navigate(['/admin-dashboard']);
        },
        error: err => {
          console.error('❌ Login failed:', err);
          alert('Login failed: ' + err.error?.message || 'Server error');
        }
      });
    }
  }
  
}
