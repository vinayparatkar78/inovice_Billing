import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './payment.component.html',
})
export class PaymentComponent {
  form: FormGroup;
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.form = this.fb.group({
      invoiceId: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      paymentMethod: ['', Validators.required],
      paymentLinkId: ['', Validators.required],
      gateway: ['', Validators.required],
    });
  
    // 👇 Listen to invoiceId changes and auto-fetch amount
    this.form.get('invoiceId')?.valueChanges.subscribe((id: string) => {
      if (id && id.length === 36) {
        this.fetchInvoiceDetails(id);
      } else {
        this.form.get('amount')?.reset(); 
      }
    });
  }
  
  fetchInvoiceDetails(invoiceId: string) {
    this.http.get<any>(`http://localhost:7059/api/Invoices/${invoiceId}`).subscribe({
      next: (invoice) => {
        if (invoice && invoice.amount) {
          this.form.patchValue({ amount: invoice.amount });
        }
      },
      error: () => {
        this.form.get('amount')?.reset(); // Reset if invoice not found
      },
    });
  }
  

  pay() {
    if (this.form.invalid) return;

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.post('http://localhost:7059/api/Payments/pay', this.form.value).subscribe({
      next: () => {
        this.successMessage = '✅ Payment successful!';
        this.form.reset();
      },
      error: (error) => {
        this.errorMessage = '❌ Payment failed. Please try again.';
        console.error(error);
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
}
