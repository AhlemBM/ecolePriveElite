import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/users/login';  // URL de votre backend

  constructor(private http: HttpClient) {}

  login(credentials: { email: string, mdp: string, role: string }): Observable<any> {
    if (!credentials.email || !credentials.mdp || !credentials.role) {
      throw new Error('All fields are required: email, password, and role');
    }

    const validRoles = ['student', 'teacher', 'parent' , 'admin'];
    if (!validRoles.includes(credentials.role)) {
      throw new Error('Invalid role selected');
    }

    return this.http.post(this.apiUrl, credentials, {
      responseType: "json",  // Utilise "json" au lieu de "arraybuffer" pour simplifier la réponse
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    });
  }

  isAuthenticated(): boolean {
    // Vérifie si un token est stocké (remplace 'token' par la clé utilisée dans ton localStorage/sessionStorage)
    return !!localStorage.getItem('token');
  }
  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}'); // Récupère l'utilisateur stocké
  }

  getTeacherId(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      return decodedToken.userId; // Retourne l'ID de l'utilisateur (enseignant)
    }
    return '';
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }
}
