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
      this.router.navigate(['/login']);
    }
  }

  getRoleName(role: string): string {
    switch(role) {
      case '1': return 'CEO';
      case '2': return 'Accounting Manager';
      case '3': return 'Supply Chain Manager';
      default: return 'Unknown';
    }
  }

  loadPowerBiReport(): void {
    const groupId = '104b6b09-ffed-4f4c-b80b-c8f4c51fe0a6';
    const reportId = 'de9745aa-ee3c-48b1-a96c-adb5d6051d73';
    const ctid = '604f1a96-cbe8-43f8-abbf-f8eaf5d85730';

    let embedUrl: string;

    switch(this.userRole) {
      case '1': // Admin
        embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${groupId}&autoAuth=true&ctid=${ctid}`;
        break;
      case '2': // Manager
        embedUrl = `https://app.powerbi.com/groups/${groupId}/reports/${reportId}/a218699726df86c71a63?experience=power-bi`;
        break;
      case '3': // Standard User
        embedUrl = `https://app.powerbi.com/groups/${groupId}/reports/${reportId}/a651fcc6fe23244ebb0f?experience=power-bi`;
        break;
      default:
        this.error = 'User role not recognized';
        this.loading = false;
        return;
    }

    this.powerBiUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    this.loading = false;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
