import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-cours-student',
  templateUrl: './list-cours-student.component.html',
  styleUrls: ['./list-cours-student.component.css']
})
export class ListCoursStudentComponent implements OnInit {

  courses: any[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;
  studentId: string = ''; // ✅ Utilisation de `string` au lieu de `String`

  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit(): void {
    this.getStudentCourses(); // ✅ Correction du nom de la méthode
  }

  // ✅ Récupérer l'ID de l'étudiant connecté depuis le token JWT
  getStudentCourses(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // ✅ Décodage sécurisé
        if (decodedToken && decodedToken.id) {
          this.studentId = decodedToken.id;
          this.loadStudentCourses(this.studentId);
          console.log(this.studentId)
        } else {
          this.errorMessage = "Invalid token. Please log in again.";
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        this.errorMessage = "Invalid token format. Please log in again.";
      }
    } else {
      this.errorMessage = "User not authenticated. Please log in.";
    }
  }

  // ✅ Charger les cours de l'étudiant connecté
  loadStudentCourses(studentId: string) {
    this.loading = true;
    this.courseService.getCoursesByStudentId(studentId).subscribe(
      (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching student courses', error);
        this.errorMessage = "Failed to load courses.";
        this.loading = false;
      }
    );
  }
}
