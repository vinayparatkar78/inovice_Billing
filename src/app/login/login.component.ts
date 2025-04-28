import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: [''],
      password: [''],
      code: ['']
    });

    // ✅ New: handle reset-password link with email and token in query params
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      const token = params['token'];

      if (email && token) {
        const newPassword = window.prompt('Enter your new password:');
        if (newPassword) {
          this.http.post('http://localhost:7059/api/Users/reset-password', {
            email,
            token,
            newPassword
          }, { responseType: 'text' }).subscribe({
            next: () => alert('Password reset successful!'),
            error: err => {
              const errorMessage = err.error?.message || err.message || 'Something went wrong';
              alert('Error: ' + errorMessage);
            }
          });
        }
      }
    });
  }

  submit() {
    this.auth.login(this.form.value).subscribe({
      next: res => {
        alert('Login successful!');
        console.log(res);
        this.router.navigate(['/invoice']);
      },
      error: err => alert('Login failed: ' + err.error)
    });
  }

  forgotPassword() {
    const email = window.prompt('Enter your registered email:');
    if (email) {
      this.http.post('http://localhost:7059/api/Users/forgot-password', { email }).subscribe({
        next: () => alert('Reset token sent to email!'),
        error: err => {
          const errorMessage = err.error?.message || err.message || 'Something went wrong';
          alert('Error: ' + errorMessage);
        }
      });
    }
  }

  resetPassword() {
    const email = window.prompt('Enter your registered email:');
    const token = window.prompt('Enter the reset token you received:');
    const newPassword = window.prompt('Enter your new password:');

    if (email && token && newPassword) {
      this.http.post('http://localhost:7059/api/Users/reset-password', {
        email,
        token,
        newPassword
      }, { responseType: 'text' }).subscribe({
        next: () => alert('Password reset successful!'),
        error: err => {
          const errorMessage = err.error?.message || err.message || 'Something went wrong';
          alert('Error: ' + errorMessage);
        }
      })
    }
  }
}
