import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClusteringService {
  private baseUrl = 'http://localhost:5000/api'; // ou l'URL de ton backend Flask

  constructor(private http: HttpClient) {}

  predictCluster(data: any) {
    return this.http.post<any>(`${this.baseUrl}/predict_cluster`, data);
  }
}
