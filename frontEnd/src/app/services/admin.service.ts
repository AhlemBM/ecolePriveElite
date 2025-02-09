import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from 'rxjs';
interface LoginResponse {
  token: string;
  user: {
    role: string;
  };
}
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getPendingUsers(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(`${this.apiUrl}/pending/getAll`, { headers });
  }

  validateUser(userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/validate/${userId}`, {});
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-user/${userId}`);
  }



  private authStatus = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  // Méthode de connexion pour l'admin
  loginAdmin(email: string, password: string):Observable<LoginResponse>  {
    return this.http.post<LoginResponse>(`${this.apiUrl}/admin-login`, { email, password }).pipe(
      tap((response) => {
        if (response && response.token && response.user) {
          // ✅ Sauvegarde sécurisée des données utilisateur
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.user.role);

          // ✅ Mise à jour de l'état d'authentification
          this.authStatus.next(true);
        }
      })
    );
  }

  /** ✅ Permet d'observer l'état de connexion */
  get authStatus$(): Observable<boolean> {
    return this.authStatus.asObservable();
  }
  /** ✅ Déconnexion */
  logout(): void {
    localStorage.clear();
    this.authStatus.next(false);
  }
}
