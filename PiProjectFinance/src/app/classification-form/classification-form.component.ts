// classification-form.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { PredictionService } from '../services/prediction.service';

@Component({
  selector: 'app-classification-form',
  templateUrl: './classification-form.component.html',
})
export class ClassificationFormComponent {
  predictionForm: FormGroup;
  predictionResult: string | null = null;
  recommendation: string | null = null;

  constructor(private fb: FormBuilder, private predictionService: PredictionService) {
    this.predictionForm = this.fb.group({
      paiements: this.fb.array([this.fb.group({ DueDate: [''], PaymentDate: [''] })]),
      RemiseUtilisee: [0],
      SupplierPrice: [0],
      TotalPrice: [0],
      NombreLitiges: [0],
      BalanceDue: [0]
    });
  }

  get paiements(): FormArray {
    return this.predictionForm.get('paiements') as FormArray;
  }

  addPaiement() {
    this.paiements.push(this.fb.group({ DueDate: [''], PaymentDate: [''] }));
  }

  submitForm() {
    // Mark all fields as touched to trigger validation messages
    this.predictionForm.markAllAsTouched();
    if (this.predictionForm.invalid) {
      return;
    }

    this.predictionService.getPrediction(this.predictionForm.value).subscribe(
      (res) => {
        if (res.prediction === 0) {
          this.predictionResult = 'The supplier is unreliable.';
        } else if (res.prediction === 1) {
          this.predictionResult = 'The supplier is reliable.';
        } else {
          this.predictionResult = 'Unexpected prediction result.';
        }

        // Set recommendation
        this.recommendation = res.recommendation;
      },
      (err) => {
        console.error('Error during prediction:', err);
      }
    );
  }
}
