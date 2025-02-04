import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/users/user.service';
import {LoginService} from "../../services/users/login.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  userRole: string | null = null;
  userId: string | null = null;

  constructor(private router: Router, private authService: LoginService) {}

  ngOnInit(): void {
    this.loadUserData();

    // Écouter les changements d'authentification en temps réel
    this.authService.authStatus$.subscribe((status) => {
      this.isLoggedIn = status;
      this.loadUserData();
    });
  }

  loadUserData(): void {
    this.isLoggedIn = !!localStorage.getItem('token');
    this.userRole = localStorage.getItem('role');
    const user = localStorage.getItem('user');

    if (user) {
      this.userId = JSON.parse(user)._id;
    }
  }

  logout(): void {
    localStorage.clear();
    this.isLoggedIn = false;
    this.userRole = null;
    this.userId = null;
    this.authService.updateAuthStatus(false); // Mettre à jour l'état global
    this.router.navigate(['/login']);
  }
}
