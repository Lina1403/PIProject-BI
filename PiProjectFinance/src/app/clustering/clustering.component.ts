import { Component } from '@angular/core';
import { ClusteringService } from '../services/clustering.service';

@Component({
  selector: 'app-clustering',
  templateUrl: './clustering.component.html',
  styleUrls: ['./clustering.component.scss']
})
export class ClusteringComponent {
  clusteringFormModel = {
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
  clusterResult: string | null = null;
  description: string = '';
  recommandation: string = '';

  constructor(private clusteringService: ClusteringService) {}

  onSubmit(): void {
    this.clusteringService.predictCluster(this.clusteringFormModel).subscribe({
      next: (response) => {
        console.log('Réponse du backend:', response);
        this.clusterResult = response.cluster || 'Résultat non disponible';
        this.description = response.description;
        this.recommandation = response.recommandation;
      },
      error: (err) => {
        console.error('Erreur lors de la prédiction du cluster:', err);
        this.clusterResult = 'Erreur serveur ou données incorrectes';

      }
    });
  }

}
