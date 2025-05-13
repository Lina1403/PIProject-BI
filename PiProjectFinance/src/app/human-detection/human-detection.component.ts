import { Component } from '@angular/core';
import { HumanDetectionService } from '../services/human-detection.service';

@Component({
  selector: 'app-human-detection',
  templateUrl: './human-detection.component.html',
  styleUrls: ['./human-detection.component.scss']
})
export class HumanDetectionComponent {
  isLoading: boolean = false;
  videoFile: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  selectedFileName: string | null = null;
  heatmapPath: string = '';
  movementChartPath: string = '';
  clusterSalesPath: string = '';
  recommendations: string = '';

  // Supprimé parsedRecommendations car maintenant nous utilisons directement recommendations

  constructor(private humanDetectionService: HumanDetectionService) {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        this.videoFile = file;
        this.selectedFileName = file.name;
      } else {
        this.errorMessage = 'Veuillez sélectionner un fichier vidéo valide.';
        this.videoFile = null;
        this.selectedFileName = null;
      }
    }
  }

  onSubmit(): void {
    if (!this.videoFile) {
      this.errorMessage = 'Veuillez télécharger une vidéo.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.heatmapPath = '';
    this.movementChartPath = '';
    this.clusterSalesPath = '';
    this.recommendations = '';

    const formData = new FormData();
    formData.append('video', this.videoFile);

    this.humanDetectionService.analyzeVideo(formData).subscribe(
      (response) => {
        this.isLoading = false;
        this.successMessage = response.message;
        this.heatmapPath = response.heatmap;
        this.movementChartPath = response.movement_chart;
        this.clusterSalesPath = response.cluster_sales;
        this.recommendations = response.recommendations || 'Aucune recommandation disponible.';
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = `Une erreur est survenue lors de l'analyse de la vidéo: ${error.message || error.statusText || 'Erreur inconnue'}`;
        console.error(error);
      }
    );
  }
  

  // Ajout de la méthode exportRecommendations()
  exportRecommendations(): void {
    // Implémentez ici la logique d'export PDF
    console.log('Export des recommandations:', this.recommendations);
    // Vous pouvez utiliser une librairie comme jspdf ou html2pdf
  }
}
