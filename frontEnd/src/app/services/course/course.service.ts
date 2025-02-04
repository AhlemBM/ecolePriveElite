import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/courses/add'; // L'URL de ton backend pour ajouter un cours
  private apiUrll = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  addCourse(courseData: { courseName: string; duration: string; description: string; avatar: string | null; teacherId: string }): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    // Utilisation de this.apiUrl pour l'appel HTTP correct
    return this.http.post(this.apiUrl, courseData, { headers });
  }
  // Méthode pour récupérer les cours d'un enseignant par ID
  getCoursesByTeacherId(teacherId: string): Observable<any> {
    return this.http.get(`${this.apiUrll}/courses/teacher/${teacherId}`);
  }

  // Méthode pour supprimer un cours par ID
  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete(`${this.apiUrll}/courses/${courseId}`);
  }

  // Méthode pour éditer un cours
  editCourse(courseId: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrll}/courses/${courseId}`, updatedData);
  }

  // Récupérer les détails d'un cours
  getCourseById(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrll}/courses/${courseId}`);
  }

  updateGradeAndEvaluation(courseId: string, studentId: string, grade: number, evaluation: string): Observable<any> {
    return this.http.put(`${this.apiUrll}/courses/grade/${courseId}/${studentId}`, { grade, evaluation });
  }
  getCoursesByStudentId(studentId: string): Observable<any> {
    return this.http.get(`${this.apiUrll}/courses/student/${studentId}`);
  }
}
