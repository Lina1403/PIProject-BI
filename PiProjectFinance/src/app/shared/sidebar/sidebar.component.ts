import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  isMobileView = false;
  userInfo: { name?: string; email?: string } | null = null;
  userRole = '';

  ngOnInit() {
    this.checkViewport();
    this.initTooltips();
    this.loadUserInfo();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkViewport();
  }

  private checkViewport() {
    this.isMobileView = window.innerWidth < 992;
    if (this.isMobileView) {
      this.isCollapsed = true;
    }
  }

  toggleCollapse() {
    if (!this.isMobileView) {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  private initTooltips() {
    setTimeout(() => {
      document.querySelectorAll('.nav-item').forEach(item => {
        const text = item.querySelector('.menu-title')?.textContent;
        if (text) {
          item.setAttribute('data-tooltip', text);
        }
      });
    }, 0);
  }

  private loadUserInfo() {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    if (storedUser) {
      this.userInfo = JSON.parse(storedUser);
    }
    if (storedRole) {
      this.userRole = this.formatRole(storedRole);
    }
  }

  private formatRole(roleId: string): string {
    switch (roleId) {
      case '1': return 'CEO';
      case '2': return 'Accounting Manager';
      case '3': return 'Supply Chain Manager';
      default:  return 'Unknown Role';
    }
  }
}
