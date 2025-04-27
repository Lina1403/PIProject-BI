import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  roleSelected = false; // Variable pour savoir si un rôle a été sélectionné
  selectedRole: string = ''; // Pour afficher le rôle sélectionné dans le message de bienvenue
  username: string = '';
  password: string = '';

  // Gérer la sélection du rôle
  selectRole(role: string) {
    this.selectedRole = role;
    this.roleSelected = true; // Lorsque le rôle est sélectionné, afficher le message de bienvenue
  }

  onLogin() {
    console.log('Login attempted');
    // Gérer la logique de connexion ici
  }
}
