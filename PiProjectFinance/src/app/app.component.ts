import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showNavbar: boolean = true;
  showSidebar: boolean = true;
  showFooter: boolean = true;
  isLoading: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Surveillez les changements de route
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;

      // Cacher les barres et le pied de page pour certaines routes
      if (currentRoute === '/login' || currentRoute === '/register') {
        this.showNavbar = false;
        this.showSidebar = false;
        this.showFooter = false;
      } else {
        this.showNavbar = true;
        this.showSidebar = true;
        this.showFooter = true;
      }
    });
  }
}
