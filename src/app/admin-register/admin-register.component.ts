import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './admin-register.component.html',
})
export class AdminRegisterComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AdminAuthService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      company_Id: ['', Validators.required] // ✅ now it's a user-input field
    });
  }
  

  submit(): void {
    if (this.form.valid) {
      this.authService.adminRegister(this.form.value).subscribe({
        next: res => {
          console.log('✅ Admin registered:', res);
          alert('Admin registered successfully!');
        },
        error: err => {
          console.error('❌ Register failed:', err);
          alert('Registration failed: ' + err.error?.message || 'Server error');
        }
      });
    }
  }
}
