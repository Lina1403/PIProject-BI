// src/app/human-detection/human-detection.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HumanDetectionService {

  private apiUrl = 'http://127.0.0.1:5000/analyse';

  constructor(private http: HttpClient) { }

  // Fonction pour envoyer la vidéo au backend pour l'analyse
  analyzeVideo(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData, {
      headers: new HttpHeaders(),
      observe: 'body'  // observe 'body' pour récupérer le JSON renvoyé
    });
  }
}

