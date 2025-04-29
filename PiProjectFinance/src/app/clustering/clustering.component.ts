import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-clustering',
  templateUrl: './clustering.component.html',
  styleUrls: ['./clustering.component.scss']
})
export class ClusteringComponent implements OnInit {
  clusteringForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.clusteringForm = this.fb.group({
      CapitalSocial: [null, [Validators.required, Validators.min(0)]],
      ChiffreAffaires: [null, [Validators.required, Validators.min(0)]],
      ResultatNet: [null, [Validators.required, Validators.min(0)]],
      RentabiliteFinanciere: [null, [Validators.required, Validators.min(0), Validators.max(1)]],
      FondRoulement: [null, [Validators.required, Validators.min(0)]],
      EvolutionChiffreAffaires: [null, [Validators.required, Validators.min(0)]],
      TotalDettes: [null, [Validators.required, Validators.min(0)]],
      Type: ['', Validators.required],
      Size: ['', Validators.required]
    });
  }

  submitForm(): void {
    if (this.clusteringForm.valid) {
      console.log('Form Submitted:', this.clusteringForm.value);
    } else {
      console.error('Form is invalid');
    }
  }
}
