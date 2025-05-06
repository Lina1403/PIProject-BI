// src/app/services/payment-prediction.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentPredictionService {
  private apiUrl = 'http://127.0.0.1:5000/predict_payment_result';

  constructor(private http: HttpClient) {}

  predictPayment(date: string) {
    const formData = new FormData();
    formData.append('date', date);
    return this.http.post(this.apiUrl, formData, { responseType: 'text' });
  }
}
