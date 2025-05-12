import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  toggleSidebar() {
    const body = document.querySelector('body');
    body.classList.toggle('sidebar-icon-only');
  }
}
