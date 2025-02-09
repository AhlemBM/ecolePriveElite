import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import {LoginService} from "../../../services/users/login.service";

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AdminService,
    private loginService: LoginService, // Assure-toi que AdminService possède la méthode updateAuthStatus (ou implémente-la)
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  /** 🔹 Connexion de l'admin */
  onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.loginAdmin(email, password).subscribe(
        (response) => {
          if (response && response.token) {
            // Stockage des données de connexion
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('role', response.user.role);

            // Notifier que l'utilisateur est connecté (Assure-toi que la méthode updateAuthStatus existe dans AdminService)
            this.loginService.updateAuthStatus(true);

            // Rediriger vers la page d'accueil ou le dashboard
            this.router.navigate(['/home']);
          }
        },
        (error) => {
          this.errorMessage = error.error?.msg || 'Échec de la connexion, veuillez réessayer.';
        }
      );
    }
  }
}
