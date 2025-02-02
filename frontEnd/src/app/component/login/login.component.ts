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

  constructor(private authService: LoginService, private router: Router) {}

  login() {
    if (this.obj.email && this.obj.mdp && this.obj.role) {
      this.authService.login(this.obj).subscribe(
        response => {
          console.log('Login successful', response);

          // Stocker le token JWT dans le localStorage
          localStorage.setItem('token', response.token);

          // Vérifier la présence de l'ID de l'utilisateur dans la réponse
          const userId = response.userId || response.user?._id;  // Récupérer l'ID de l'utilisateur

          // Si l'ID est présent, rediriger vers la page de profil
          if (userId) {
            // Stocker l'ID dans le localStorage si vous voulez y accéder plus tard
            localStorage.setItem('user', JSON.stringify(response.user));

            // Rediriger vers la page de profil avec l'ID
            this.router.navigate([`/profile/${userId}`]);
          } else {
            this.erreur = 'User ID is missing in the response.';
          }
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
