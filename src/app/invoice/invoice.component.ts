import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Invoice as InvoiceModel } from './invoice.model';
import { RouterModule } from '@angular/router';

interface Invoice {
  userId: string;
  amount: number;
  dueDate: string;
  currency: string;
  companyId: string;
  createdAt?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-invoice',
  standalone: true,
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ]
})
export class InvoiceComponent implements OnInit {
  form!: FormGroup;
  invoiceId: string = '';
  userIdToFetch: string = '';
  fetchedInvoice: Invoice | null = null;
  fetchedUserInvoices: Invoice[] = [];
  pagedInvoices: Invoice[] = [];
  isDarkMode: boolean = false;
  activeTab: string = 'create';
  invoiceForm!: FormGroup; 


  invoicesPerPage = 4;
  currentPage = 0;
  totalPages = 0;

  showInvoiceForm: boolean = false;


  exportPDF(): void {
    // Replace this with your actual PDF export logic
    console.log('Exporting PDF...');
  }
  
  exportExcel(): void {
    // Replace this with your actual Excel export logic
    console.log('Exporting Excel...');
  }
  

  private baseUrl = 'http://localhost:7059/api/Invoices';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

 


  ngOnInit(): void {
    this.invoiceForm = this.fb.group({
      userId: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]],
      dueDate: ['', Validators.required],
      currency: ['', Validators.required],
      companyId: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    const formData = { ...this.form.value };
    formData.dueDate = new Date(formData.dueDate).toISOString();

    this.http.post(this.baseUrl, formData).subscribe({
      next: () => {
        alert('✅ Invoice created successfully!');
        this.form.reset();
        this.fetchInvoicesByUser(); // 🔁 Refresh user invoices after creation
      },
      error: (err) => {
        console.error(err);
        alert('❌ Failed to create invoice.');
      },
    });
  }

  fetchInvoiceById(): void {
    if (!this.invoiceId) return;
  
    this.http.get<Invoice>(`${this.baseUrl}/${this.invoiceId}`).subscribe({
      next: (res) => {
        // ✅ Step 1: Ensure dueDate is in ISO format
        let formattedDate = '';
        if (res.dueDate) {
          // Convert to ISO-compatible format (replace space with T)
          const rawDueDate = res.dueDate.replace(' ', 'T'); // "2025-04-12T05:30:00"
          const parsedDate = new Date(rawDueDate);
  
          if (!isNaN(parsedDate.getTime())) {
            formattedDate = parsedDate.toISOString().split('T')[0]; // "2025-04-12"
          } else {
            console.warn('Invalid date:', res.dueDate);
          }
        }
  
        // ✅ Step 2: Patch values into the form
        this.invoiceForm.patchValue({
          userId: res.userId,
          amount: res.amount,
          dueDate: formattedDate, // yyyy-MM-dd
          currency: res.currency,
          companyId: res.companyId,
          // Add more fields if needed
        });
  
        this.fetchedInvoice = res; // Optional use
      },
      error: (err) => {
        console.error(err);
        alert('❌ Invoice not found.');
        this.fetchedInvoice = null;
      },
    });
  }
  
  
  

  fetchInvoicesByUser(): void {
    if (!this.userIdToFetch.trim()) return;

    this.http.get<Invoice[]>(`${this.baseUrl}/user/${this.userIdToFetch}`).subscribe({
      next: (res) => {
        this.fetchedUserInvoices = res;
        this.totalPages = Math.ceil(this.fetchedUserInvoices.length / this.invoicesPerPage);
        this.currentPage = 0;
        this.updatePagedInvoices();
      },
      error: (err) => {
        console.error(err);
        alert('❌ Failed to fetch invoices for user.');
        this.fetchedUserInvoices = [];
        this.pagedInvoices = [];
      },
    });
  }

  updatePagedInvoices(): void {
    const start = this.currentPage * this.invoicesPerPage;
    const end = start + this.invoicesPerPage;
    this.pagedInvoices = this.fetchedUserInvoices.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePagedInvoices();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagedInvoices();
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode); // ✅ Add class to body
  }

  toggleInvoiceForm(): void {
    this.showInvoiceForm = !this.showInvoiceForm;
  }

  downloadInvoice(invoiceId: string): void {
    const downloadUrl = `${this.baseUrl}/download/${invoiceId}`;

    this.http.get(downloadUrl, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);

        a.href = objectUrl;
        a.download = `invoice-${invoiceId}.pdf`;
        a.click();

        URL.revokeObjectURL(objectUrl);
      },
      error: (err) => {
        console.error('❌ Error downloading invoice:', err);
        alert('Failed to download the invoice. Please try again.');
      }
    });
  }
}
