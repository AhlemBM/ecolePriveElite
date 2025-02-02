import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) { }

  // Récupérer un utilisateur par son ID
// Service pour récupérer l'utilisateur par ID
  getUserById(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token); // Ajouter le token JWT

    return this.http.get(`${this.apiUrl}/${userId}`, { headers });
  }

  // Ajouter un enfant
  addChild(userId: string, tel: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${userId}/add-child`, { tel });
  }

  // Récupérer les informations de l'utilisateur connecté
  /*getUserInfo(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Ajouter le token au header de la requête

    return this.http.get(`${this.apiUrl}/users/me`, { headers }); // Route pour récupérer l'utilisateur par son ID (ou un endpoint spécifique pour l'utilisateur)
  }*/

  // Vérifier si l'utilisateur est connecté en fonction du token
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  // Récupérer tous les enseignants
  getAllTeachers(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map((response: any) => {
        console.log('Réponse du backend:', response); // 🔥 DEBUG
        if (Array.isArray(response)) {
          return response.filter((user: any) => user.role === 'teacher'); // ✅ Ajout du type `any`
        } else if (response && Array.isArray(response.users)) {
          return response.users.filter((user: any) => user.role === 'teacher'); // ✅ Ajout du type `any`
        } else {
          console.error("Format inattendu :", response);
          return []; // Retourne un tableau vide si la réponse est incorrecte
        }
      })
    );
  }

  // Supprimer un enseignant par ID
  deleteTeacher(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  // Récupérer tous les étudiants (role = 'student')
  getAllStudents(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map(response => {
        console.log('Réponse du backend:', response); // 🔥 DEBUG
        if (Array.isArray(response)) {
          return response.filter(user => user.role === 'student'); // Cas 1 : la réponse est un tableau direct
        } else if (response && Array.isArray(response.users)) {
          return response.users.filter((user:any) => user.role === 'student'); // Cas 2 : réponse sous format { users: [...] }
        } else {
          console.error("Format inattendu :", response);
          return []; // Retourne un tableau vide si la réponse est incorrecte
        }
      })
    );
  }

  // Supprimer un utilisateur par ID
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  // 🔥 Ajouter un enseignant
  addTeacher(teacherData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, teacherData); // 🔥 Assure-toi que le backend gère bien `signup`
  }
  // Ajouter un étudiant
  addStudent(studentData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, studentData); // Utiliser l'URL du backend pour l'ajout d'un étudiant
  }
}
