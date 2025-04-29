import { Component } from '@angular/core';
import { PaymentPredictionService } from '../services/payment-prediction.service';

@Component({
  selector: 'app-payment-prediction',
  templateUrl: './payment-prediction.component.html'
})
export class PaymentPredictionComponent {
  selectedDate: string = '';
  predictedAmount: number | null = null;
  errorMessage: string = '';

  constructor(private paymentService: PaymentPredictionService) {}

  onSubmit() {
    this.predictedAmount = null;
    this.errorMessage = '';

    this.paymentService.predictPayment(this.selectedDate).subscribe({
      next: (htmlResponse) => {
        const match = htmlResponse.match(/<strong>(.*?)<\/strong>/);
        if (match && match[1]) {
          this.predictedAmount = parseFloat(match[1]);
        } else {
          this.errorMessage = "Impossible d'extraire le montant depuis la réponse HTML.";
        }
      },
      error: (error) => {
        this.errorMessage = error.error || "Erreur lors de la prédiction.";
      }
    });
  }
}
