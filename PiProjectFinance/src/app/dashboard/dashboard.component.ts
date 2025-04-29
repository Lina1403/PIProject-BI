import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  powerBiUrl: SafeResourceUrl;
  loading = true;
  error: string = null;
  userRole: string;
  userName: string;

  private readonly powerBiConfig = {
    embedUrls: {
      '1': `https://app.powerbi.com/reportEmbed?reportId=de9745aa-ee3c-48b1-a96c-adb5d6051d73&groupId=104b6b09-ffed-4f4c-b80b-c8f4c51fe0a6&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtQS1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJtb2Rlcm5FbWJlZCI6dHJ1ZX19`,
      '2': `https://app.powerbi.com/reportEmbed?reportId=de9745aa-ee3c-48b1-a96c-adb5d6051d73&groupId=104b6b09-ffed-4f4c-b80b-c8f4c51fe0a6&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730&pageName=ReportSection2`,
      '3': `https://app.powerbi.com/reportEmbed?reportId=de9745aa-ee3c-48b1-a96c-adb5d6051d73&groupId=104b6b09-ffed-4f4c-b80b-c8f4c51fe0a6&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730&pageName=ReportSection3`
    }
  };

  private messageHandler = this.handlePowerBiMessages.bind(this);

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.checkAuthAndLoadReport();
    window.addEventListener('message', this.messageHandler, false);
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.messageHandler);
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
      const embedUrl = this.powerBiConfig.embedUrls[this.userRole];
      if (!embedUrl) throw new Error(`No Power BI configuration found for role ${this.userRole}`);

      this.powerBiUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } catch (e) {
      console.error('Error loading Power BI report:', e);
      this.error = 'Failed to load Power BI report: ' + e.message;
    } finally {
      this.loading = false;
    }
  }

  private handlePowerBiMessages(event: MessageEvent): void {
    if (event.data?.event) {
      console.log('Power BI Message:', event.data);

      if (event.data.event === 'error') {
        this.error = 'Power BI loading error: ' + (event.data.detail || 'Unknown error');
        this.loading = false;
      } else if (event.data.event === 'loaded') {
        this.error = null;
        this.loading = false;
      }
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
