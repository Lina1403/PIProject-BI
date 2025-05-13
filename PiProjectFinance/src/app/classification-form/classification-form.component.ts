// Updated component with new functionality
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { PredictionService } from '../services/prediction.service';

@Component({
  selector: 'app-classification-form',
  templateUrl: './classification-form.component.html',
  styleUrls: ['./classification-form.component.scss']
})
export class ClassificationFormComponent {
  predictionForm: FormGroup;
  predictionResult: string | null = null;
  recommendation: string | null = null;
  showDetails = false;
  formProgress = 0;

  sections = {
    payments: true,
    financial: true,
    disputes: true
  };

  assessmentFactors = [
    { text: 'Payment history shows consistent on-time payments', positive: true },
    { text: 'Discount utilization within expected range', positive: true },
    { text: 'No outstanding balance issues detected', positive: true },
    { text: 'Minimal disputes reported', positive: true }
  ];

  constructor(private fb: FormBuilder, private predictionService: PredictionService) {
    this.predictionForm = this.fb.group({
      paiements: this.fb.array([
        this.createPaymentGroup()
      ]),
      RemiseUtilisee: [0, [Validators.min(0), Validators.max(100)]],
      SupplierPrice: [0, [Validators.required, Validators.min(0)]],
      TotalPrice: [0, [Validators.required, Validators.min(0)]],
      NombreLitiges: [0, [Validators.min(0)]],
      BalanceDue: [0, [Validators.min(0)]]
    });

    // Calculate form progress
    this.predictionForm.valueChanges.subscribe(() => {
      this.calculateProgress();
    });
  }

  createPaymentGroup(): FormGroup {
    return this.fb.group({
      DueDate: ['', Validators.required],
      PaymentDate: ['', Validators.required]
    });
  }

  get paiements(): FormArray {
    return this.predictionForm.get('paiements') as FormArray;
  }

  addPaiement() {
    this.paiements.push(this.createPaymentGroup());
    this.calculateProgress();
  }

  removePayment(index: number) {
    this.paiements.removeAt(index);
    this.calculateProgress();
  }

  toggleSection(section: string) {
    this.sections[section] = !this.sections[section];
  }

  calculateProgress() {
    let completed = 0;
    let total = 0;

    // Check all form controls
    Object.keys(this.predictionForm.controls).forEach(key => {
      if (key === 'paiements') {
        const payments = this.paiements.controls;
        payments.forEach(payment => {
          Object.keys(payment.value).forEach(paymentKey => {
            total++;
            if (payment.get(paymentKey)?.valid) completed++;
          });
        });
      } else {
        total++;
        if (this.predictionForm.get(key)?.valid) completed++;
      }
    });

    this.formProgress = Math.round((completed / total) * 100);
  }

  submitForm() {
    this.predictionForm.markAllAsTouched();
    if (this.predictionForm.invalid) return;

    // Simulate API call
    this.predictionService.getPrediction(this.predictionForm.value).subscribe(
      (res) => {
        if (res.prediction === 0) {
          this.predictionResult = 'High Risk';
          this.recommendation = 'Consider alternative suppliers or implement strict payment terms.';
          this.updateAssessmentFactors(false);
        } else if (res.prediction === 1) {
          this.predictionResult = 'Low Risk';
          this.recommendation = 'This supplier meets all reliability criteria.';
          this.updateAssessmentFactors(true);
        } else {
          this.predictionResult = 'Medium Risk';
          this.recommendation = 'Monitor this supplier closely and review terms periodically.';
          this.updateAssessmentFactors(null);
        }
      },
      (err) => {
        console.error('Error during prediction:', err);
      }
    );
  }

  updateAssessmentFactors(isReliable: boolean | null) {
    if (isReliable === true) {
      this.assessmentFactors = [
        { text: 'Payment history shows consistent on-time payments', positive: true },
        { text: 'Discount utilization within expected range', positive: true },
        { text: 'No outstanding balance issues detected', positive: true },
        { text: 'Minimal disputes reported', positive: true }
      ];
    } else if (isReliable === false) {
      this.assessmentFactors = [
        { text: 'Late payments detected in history', positive: false },
        { text: 'High discount utilization may indicate cash flow issues', positive: false },
        { text: 'Significant outstanding balance detected', positive: false },
        { text: 'Multiple disputes reported', positive: false }
      ];
    } else {
      this.assessmentFactors = [
        { text: 'Some late payments in history', positive: false },
        { text: 'Moderate discount utilization', positive: true },
        { text: 'Small outstanding balance present', positive: false },
        { text: 'Few disputes reported', positive: true }
      ];
    }
  }

  getResultClass() {
    if (this.predictionResult === 'High Risk') return 'result-high';
    if (this.predictionResult === 'Medium Risk') return 'result-medium';
    if (this.predictionResult === 'Low Risk') return 'result-low';
    return '';
  }

  getResultIcon() {
    if (this.predictionResult === 'High Risk') return 'bi bi-exclamation-triangle-fill';
    if (this.predictionResult === 'Medium Risk') return 'bi bi-exclamation-circle-fill';
    if (this.predictionResult === 'Low Risk') return 'bi bi-check-circle-fill';
    return 'bi bi-question-circle-fill';
  }

  resetForm() {
    this.predictionForm.reset({
      paiements: this.fb.array([this.createPaymentGroup()]),
      RemiseUtilisee: 0,
      SupplierPrice: 0,
      TotalPrice: 0,
      NombreLitiges: 0,
      BalanceDue: 0
    });
    this.predictionResult = null;
    this.recommendation = null;
    this.showDetails = false;
    this.formProgress = 0;
  }
}
