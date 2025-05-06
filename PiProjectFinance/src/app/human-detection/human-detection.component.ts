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
  selectedFileName: string | null = null;  // Afficher le nom du fichier sélectionné
  heatmapPath: string = '';
  movementChartPath: string = '';
  clusterSalesPath: string = ''; // ✅ Nouveau champ
  recommendations: string = '';

  constructor(private humanDetectionService: HumanDetectionService) {}

  // Fonction pour gérer le changement de fichier
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        this.videoFile = file;
        this.selectedFileName = file.name;  // Afficher le nom du fichier
      } else {
        this.errorMessage = 'Veuillez sélectionner un fichier vidéo valide.';
        this.videoFile = null;
        this.selectedFileName = null;
      }
    }
  }

  // Fonction pour envoyer la vidéo pour analyse
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

    const formData = new FormData();
    formData.append('video', this.videoFile);

    this.humanDetectionService.analyzeVideo(formData).subscribe(
      (response) => {
        this.isLoading = false;
        this.successMessage = response.message;
        this.heatmapPath = response.heatmap;
        this.movementChartPath = response.movement_chart;
        this.clusterSalesPath = response.cluster_sales; // ✅ Nouveau champ affecté
        this.recommendations = response.recommendations || 'Aucune recommandation disponible.'; // ✅ Nouveau champ
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = `Une erreur est survenue lors de l'analyse de la vidéo: ${error.message || error.statusText || 'Erreur inconnue'}`;
        console.error(error);
      }
    );
  }
}
