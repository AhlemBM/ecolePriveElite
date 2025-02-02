import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/users/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: any = {};  // Informations de l'utilisateur connecté
  isLoggedIn: boolean = false;  // Vérifie si l'utilisateur est connecté
  userRole: string = ''; // Rôle de l'utilisateur (admin, teacher, student, etc.)

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.checkLoginStatus(); // Vérifier le statut de la connexion
  }

  // Vérifier si l'utilisateur est connecté
  checkLoginStatus(): void {
    const token = localStorage.getItem('token'); // Vérifier si le token est présent dans le localStorage
    if (token) {
      this.isLoggedIn = true;
      const decodedToken = this.decodeToken(token); // Décoder le token pour récupérer les informations de l'utilisateur
      this.user = decodedToken.user;
      this.userRole = decodedToken.role; // Récupérer le rôle de l'utilisateur
    } else {
      this.isLoggedIn = false;
    }
  }

  // Décoder le token pour récupérer les informations de l'utilisateur
  decodeToken(token: string): any {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Décoder la partie payload du JWT
    return decodedToken;
  }

  // Méthode de déconnexion
  logout(): void {
    localStorage.removeItem('token'); // Supprimer le token du localStorage
    this.isLoggedIn = false; // Mettre à jour l'état de connexion
    this.router.navigate(['/login']); // Rediriger vers la page de connexion
  }
}
