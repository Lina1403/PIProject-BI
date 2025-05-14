import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardUrl: SafeResourceUrl;
  loading = true;
  error: string | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngOnDestroy(): void {}

  loadDashboard(): void {
    this.loading = true;
    this.error = null;

    try {
      // Nouvelle URL du rapport Power BI avec les bons paramètres
      const baseUrl = 'https://app.powerbi.com/reportEmbed?reportId=dc602b7a-7376-47ec-acad-46014812732e';
      const params = {
        autoAuth: 'true',
        ctid: '604f1a96-cbe8-43f8-abbf-f8eaf5d85730',
        navContentPaneEnabled: 'false',
        actionBarEnabled: 'false',
        filterPaneEnabled: 'false'
      };

      const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      const fullUrl = `${baseUrl}&${queryString}`;
      this.dashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
    } catch (e) {
      console.error('Failed to load dashboard:', e);
      this.error = 'Échec du chargement du tableau de bord. Veuillez réessayer plus tard.';
    } finally {
      this.loading = false;
    }
  }
}
