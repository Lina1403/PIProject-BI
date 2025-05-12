import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;

  constructor() { }

  ngOnInit() {
    this.initSidebarHover();
  }

  private initSidebarHover() {
    const body = document.querySelector('body');

    document.querySelectorAll('.sidebar .nav-item').forEach(el => {
      el.addEventListener('mouseover', () => {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', () => {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    const body = document.querySelector('body');
    body.classList.toggle('sidebar-icon-only');
  }
}
