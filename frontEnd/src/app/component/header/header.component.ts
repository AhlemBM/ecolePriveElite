import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/users/login.service';

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

    // Mise à jour automatique sur changement d'état
    this.authService.authStatus$.subscribe((status) => {
      this.isLoggedIn = status;
      this.loadUserData();
    });
  }

  loadUserData(): void {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const user = localStorage.getItem('user');

    this.isLoggedIn = !!token;
    this.userRole = role;
    this.userId = user ? JSON.parse(user)._id : null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
