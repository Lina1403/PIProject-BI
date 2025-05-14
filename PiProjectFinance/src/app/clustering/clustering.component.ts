import { Component } from '@angular/core';
import { ClusteringService } from '../services/clustering.service';

@Component({
  selector: 'app-clustering',
  templateUrl: './clustering.component.html',
  styleUrls: ['./clustering.component.scss']
})
export class ClusteringComponent {
  clusteringFormModel = {
    Capital_Social: null as number | null,
    Rentabilite_Financiere: null as number | null,
    Resultat_Net: null as number | null,
    Evolution_Chiffre_Affaires: null as number | null,
    Chiffre_Affaires: null as number | null,
    Fond_Roulement: null as number | null,
    Total_Dettes: null as number | null,
    Type: '',
    Size: ''
  };

  clusterResult: string | null = null;
  description: string = '';
  recommandation: string = '';
  isLoading: boolean = false;
  submitted: boolean = false;

  sections = {
    financial: true,
    company: true
  };

  constructor(private clusteringService: ClusteringService) {}

  toggleSection(section: string): void {
    this.sections[section] = !this.sections[section];
  }

  onSubmit(form: any): void {
    this.submitted = true;

    if (this.isFormValid()) {
      this.isLoading = true;

      this.clusteringService.predictCluster(this.clusteringFormModel).subscribe({
        next: (response) => {
          this.clusterResult = response.cluster.toString();
          this.description = response.description;
          this.recommandation = response.recommandation;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Cluster prediction error:', error);
          this.isLoading = false;
          this.clusterResult = 'Error';
          this.description = 'An error occurred during analysis';
          this.recommandation = 'Please try again or contact support';
        }
      });
    }
  }

  isFormValid(): boolean {
    return (
      this.clusteringFormModel.Capital_Social !== null &&
      this.clusteringFormModel.Rentabilite_Financiere !== null &&
      this.clusteringFormModel.Resultat_Net !== null &&
      this.clusteringFormModel.Evolution_Chiffre_Affaires !== null &&
      this.clusteringFormModel.Chiffre_Affaires !== null &&
      this.clusteringFormModel.Fond_Roulement !== null &&
      this.clusteringFormModel.Total_Dettes !== null &&
      this.clusteringFormModel.Type !== '' &&
      this.clusteringFormModel.Size !== '' &&
      (this.clusteringFormModel.Rentabilite_Financiere === null ||
       (this.clusteringFormModel.Rentabilite_Financiere >= 0 &&
        this.clusteringFormModel.Rentabilite_Financiere <= 100)) &&
      (this.clusteringFormModel.Resultat_Net === null || this.clusteringFormModel.Resultat_Net >= 0) &&
      (this.clusteringFormModel.Chiffre_Affaires === null || this.clusteringFormModel.Chiffre_Affaires >= 0) &&
      (this.clusteringFormModel.Total_Dettes === null || this.clusteringFormModel.Total_Dettes >= 0)
    );
  }

  calculateProgress(): number {
    let completed = 0;
    const totalFields = 9; // Total number of required fields

    if (this.clusteringFormModel.Capital_Social !== null) completed++;
    if (this.clusteringFormModel.Rentabilite_Financiere !== null) completed++;
    if (this.clusteringFormModel.Resultat_Net !== null) completed++;
    if (this.clusteringFormModel.Evolution_Chiffre_Affaires !== null) completed++;
    if (this.clusteringFormModel.Chiffre_Affaires !== null) completed++;
    if (this.clusteringFormModel.Fond_Roulement !== null) completed++;
    if (this.clusteringFormModel.Total_Dettes !== null) completed++;
    if (this.clusteringFormModel.Type !== '') completed++;
    if (this.clusteringFormModel.Size !== '') completed++;

    return Math.round((completed / totalFields) * 100);
  }

  getResultClass(): string {
    if (!this.clusterResult) return '';

    const clusterNum = parseInt(this.clusterResult);
    switch(clusterNum) {
      case 0: return 'result-high';
      case 1: return 'result-medium';
      case 2: return 'result-low';
      default: return '';
    }
  }

  getResultIcon(): string {
    if (!this.clusterResult) return 'bi bi-question-circle-fill';

    const clusterNum = parseInt(this.clusterResult);
    switch(clusterNum) {
      case 0: return 'bi bi-exclamation-triangle-fill';
      case 1: return 'bi bi-exclamation-circle-fill';
      case 2: return 'bi bi-check-circle-fill';
      default: return 'bi bi-question-circle-fill';
    }
  }

  resetForm(): void {
    this.clusteringFormModel = {
      Capital_Social: null,
      Rentabilite_Financiere: null,
      Resultat_Net: null,
      Evolution_Chiffre_Affaires: null,
      Chiffre_Affaires: null,
      Fond_Roulement: null,
      Total_Dettes: null,
      Type: '',
      Size: ''
    };
    this.clusterResult = null;
    this.description = '';
    this.recommandation = '';
    this.submitted = false;
  }
}
