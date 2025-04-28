import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './otp.component.html',
})
export class OtpComponent {
  otpForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.otpForm = this.fb.group({
      userId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  generateOtp() {
    if (this.otpForm.valid) {
      this.http.post('http://localhost:7059/api/OTP/generate', this.otpForm.value).subscribe({
        next: res => alert('OTP Sent Successfully!'),
        error: err => alert('Failed to generate OTP')
      });
    }
  }
}
