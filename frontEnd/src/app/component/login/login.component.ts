import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from "../../services/users/login.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  obj = {
    email: '',
    mdp: '',
    role: ''
  };

  erreur: string = '';

  constructor(
    private authService: LoginService,
    private router: Router,
    //private authStatusService: AuthService // Injecter AuthService
  ) {}

  login() {
    if (this.obj.email && this.obj.mdp && this.obj.role) {
      this.authService.login(this.obj).subscribe(
        response => {
          console.log('Login successful', response);

          // Stocker les données utilisateur
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          if (response.user?.role) {
            localStorage.setItem('role', response.user.role);
          }

          // Mettre à jour l'état global d'authentification
          this.authService.updateAuthStatus(true);

          // Rediriger vers la page d'accueil
          this.router.navigate(['/home']);
        },
        error => {
          this.erreur = 'Invalid credentials or server error';
          console.error('Login failed', error);
        }
      );
    }
  }

  ngOnInit(): void {}
}
