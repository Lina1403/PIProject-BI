import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  powerBiUrl: SafeResourceUrl;
  loading = true;
  error: string = null;
  userRole: string;
  userName: string;

  // Configuration Power BI
  private readonly powerBiConfig = {
    groupId: '104b6b09-ffed-4f4c-b80b-c8f4c51fe0a6',
    reportId: 'de9745aa-ee3c-48b1-a96c-adb5d6051d73',
    tenantId: '604f1a96-cbe8-43f8-abbf-f8eaf5d85730',
    // Nouvelle structure des URLs avec paramètres complets
    embedUrls: {
      '1': `https://app.powerbi.com/reportEmbed?reportId=de9745aa-ee3c-48b1-a96c-adb5d6051d73&groupId=104b6b09-ffed-4f4c-b80b-c8f4c51fe0a6&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtQS1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJtb2Rlcm5FbWJlZCI6dHJ1ZX19`, // CEO
      '2': `https://app.powerbi.com/reportEmbed?reportId=de9745aa-ee3c-48b1-a96c-adb5d6051d73&groupId=104b6b09-ffed-4f4c-b80b-c8f4c51fe0a6&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtQS1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJtb2Rlcm5FbWJlZCI6dHJ1ZX19&roles=Accounting`, // Accounting Manager
      '3': `https://app.powerbi.com/reportEmbed?reportId=de9745aa-ee3c-48b1-a96c-adb5d6051d73&groupId=104b6b09-ffed-4f4c-b80b-c8f4c51fe0a6&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtQS1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJtb2Rlcm5FbWJlZCI6dHJ1ZX19&roles=SupplyChain` // Supply Chain Manager
    }
  };

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.checkAuthAndLoadReport();
  }

  checkAuthAndLoadReport(): void {
    this.userRole = localStorage.getItem('role');
    const userData = localStorage.getItem('user');

    if (!this.userRole || !userData) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const user = JSON.parse(userData);
      this.userName = user.name || user.email;
      this.loadPowerBiReport();
    } catch (e) {
      console.error('Error parsing user data', e);
      this.error = 'Failed to load user data';
      this.loading = false;
    }
  }

  getRoleName(role: string): string {
    const roles = {
      '1': 'CEO',
      '2': 'Accounting Manager',
      '3': 'Supply Chain Manager'
    };
    return roles[role] || 'Unknown';
  }

  loadPowerBiReport(): void {
    this.loading = true;
    this.error = null;

    try {
      // Vérification que le rôle existe dans la configuration
      if (!this.powerBiConfig.embedUrls[this.userRole]) {
        throw new Error(`No Power BI configuration found for role ${this.userRole}`);
      }

      // Récupération de l'URL pré-configurée
      const embedUrl = this.powerBiConfig.embedUrls[this.userRole];

      console.log('Power BI Embed URL:', embedUrl); // Debug log

      // Sécurisation de l'URL
      this.powerBiUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);

      // Ajout d'un écouteur pour détecter les erreurs de chargement
      window.addEventListener('message', this.handlePowerBiMessages.bind(this), false);

    } catch (e) {
      console.error('Error loading Power BI report:', e);
      this.error = 'Failed to load Power BI report: ' + e.message;
    } finally {
      this.loading = false;
    }
  }

  // Nouvelle méthode pour gérer les messages de Power BI
  private handlePowerBiMessages(event: MessageEvent): void {
    if (event.data && event.data.event) {
      console.log('Power BI Message:', event.data);

      if (event.data.event === 'error') {
        this.error = 'Power BI loading error: ' + (event.data.detail || 'Unknown error');
        this.loading = false;
      }

      if (event.data.event === 'loaded') {
        this.error = null;
        this.loading = false;
      }
    }
  }

  ngOnDestroy(): void {
    // Nettoyage de l'écouteur d'événements
    window.removeEventListener('message', this.handlePowerBiMessages.bind(this));
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
