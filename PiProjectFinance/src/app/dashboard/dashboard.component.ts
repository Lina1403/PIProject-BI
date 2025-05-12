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

  ngOnDestroy(): void {
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = null;

    try {
      // Désactive la barre d'action et le volet de filtre
      const baseUrl = 'https://app.powerbi.com/reportEmbed?reportId=de9745aa-ee3c-48b1-a96c-adb5d6051d73';
      const params = {
        autoAuth: 'true',
        ctid: '604f1a96-cbe8-43f8-abbf-f8eaf5d85730',
              navContentPaneEnabled: 'false',  // Désactive la barre de navigation

        actionBarEnabled: 'false',  // Désactive la barre d'action
        filterPaneEnabled: 'false'  // Désactive le volet de filtre
      };

      const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      const fullUrl = `${baseUrl}&${queryString}`;
      this.dashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
    } catch (e) {
      console.error('Failed to load dashboard:', e);
      this.error = 'Failed to load dashboard. Please try again later.';
    } finally {
      this.loading = false;
    }
  }
}
