// src/app/human-detection/human-detection.component.ts

// src/app/human-detection/human-detection.component.ts

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
  heatmapPath: string = '';
  movementChartPath: string = '';
  clusterSalesPath: string = ''; // ✅ Nouveau champ

  constructor(private humanDetectionService: HumanDetectionService) {}

  // Fonction pour gérer le changement de fichier
  onFileChange(event: any): void {
    this.videoFile = event.target.files[0];
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
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = `Une erreur est survenue lors de l'analyse de la vidéo: ${error.message || error.statusText || 'Erreur inconnue'}`;
        console.error(error);
      }
    );
  }
}
