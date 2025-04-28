import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './report.component.html'
})
export class ReportComponent {
  form: FormGroup;
  summary: any = null;
  isArray: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      startDate: [null],
      endDate: [null]
    });
  }

  fetchSummary() {
    const { startDate, endDate } = this.form.value;
    this.http.get<any>('http://localhost:7059/api/Report/Summary', {
      params: {
        startDate,
        endDate
      }
    }).subscribe({
      next: (res) => {
        console.log('Summary Response:', res);
        this.summary = res;
      },
      error: (err) => alert('Failed to fetch summary')
    });
  }
  
  

  downloadPdf() {
    this.http.post('http://localhost:7059/api/Report/DownloadPdf', this.form.value, {
      responseType: 'blob'
    }).subscribe(blob => this.downloadFile(blob, 'report.pdf'));
  }

  downloadExcel() {
    this.http.post('http://localhost:7059/api/Report/DownloadExcel', this.form.value, {
      responseType: 'blob'
    }).subscribe(blob => this.downloadFile(blob, 'report.xlsx'));
  }

  private downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  formatKey(key: any): string {
    return String(key)
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, str => str.toUpperCase());
  }
  
  
}
