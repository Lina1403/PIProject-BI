import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentPredictionService } from '../services/payment-prediction.service';

@Component({
  selector: 'app-payment-prediction',
  templateUrl: './payment-prediction.component.html',
  styleUrls: ['./payment-prediction.component.scss']
})
export class PaymentPredictionComponent implements OnInit {
  predictionForm: FormGroup;
  predictedAmount: number | null = null;
  errorMessage: string = '';
  showDetails = false;
  formProgress = 0;

  sections = {
    prediction: true
  };

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentPredictionService
  ) {
    this.predictionForm = this.fb.group({
      predictionDate: ['', Validators.required]
    });

    // Calculate form progress
    this.predictionForm.valueChanges.subscribe(() => {
      this.calculateProgress();
    });
  }

  ngOnInit() {
    this.calculateProgress();
  }

  toggleSection(section: string) {
    this.sections[section] = !this.sections[section];
  }

  calculateProgress() {
    let completed = 0;
    let total = 0;

    Object.keys(this.predictionForm.controls).forEach(key => {
      total++;
      if (this.predictionForm.get(key)?.valid) completed++;
    });

    this.formProgress = Math.round((completed / total) * 100);
  }

  onSubmit() {
    this.predictionForm.markAllAsTouched();
    if (this.predictionForm.invalid) return;

    this.predictedAmount = null;
    this.errorMessage = '';

    const predictionDate = this.predictionForm.get('predictionDate')?.value;

    this.paymentService.predictPayment(predictionDate).subscribe({
      next: (htmlResponse) => {
        const match = htmlResponse.match(/<strong>(.*?)<\/strong>/);
        if (match && match[1]) {
          this.predictedAmount = parseFloat(match[1]);
        } else {
          this.errorMessage = 'Could not extract amount from HTML response.';
        }
      },
      error: (error) => {
        this.errorMessage = error.error || 'Error occurred during prediction.';
      }
    });
  }

  getResultClass() {
    return this.predictedAmount !== null ? 'result-low' : 'result-high';
  }

  getResultIcon() {
    return this.predictedAmount !== null ? 'bi bi-currency-bitcoin-fill' : 'bi bi-exclamation-triangle-fill';
  }

  resetForm() {
    this.predictionForm.reset();
    this.predictedAmount = null;
    this.errorMessage = '';
    this.showDetails = false;
    this.formProgress = 0;
  }
}
