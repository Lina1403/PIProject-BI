import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CashFlowService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  getCashFlowData(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cash_flow_page`, formData);
  }

  downloadPdf(data: any): Observable<Blob> {
    return this.http.post<Blob>(`${this.apiUrl}/download_pdf`, data, {
      responseType: 'blob' as 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof Blob) {
          return new Observable<Blob>(observer => {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
              try {
                const errMsg = JSON.parse(e.target?.result as string);
                observer.error(errMsg.message || 'Unknown server error');
              } catch (e) {
                observer.error('Error reading server response');
              }
            };
            reader.onerror = () => observer.error('Error reading error blob');
            reader.readAsText(error.error);
          });
        }
        return throwError(() => error);
      })
    );
  }
}
