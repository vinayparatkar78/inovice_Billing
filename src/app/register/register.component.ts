import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      companyId: ['', Validators.required], 
      phone: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) {
      alert('Please fill all required fields.');
      return;
    }

    this.auth.register(this.form.value).subscribe({
      next: () => {
        alert('Registration successful!');
        this.router.navigate(['/login']); 
      },
      error: err => alert('Error during registration: ' + err.error)
    });
  }
}
