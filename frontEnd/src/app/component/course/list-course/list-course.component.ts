import { Component, OnInit } from '@angular/core';
import {CourseService} from "../../../services/course/course.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-list-course',
  templateUrl: './list-course.component.html',
  styleUrls: ['./list-course.component.css']
})
export class ListCourseComponent implements OnInit {
  courses: any[] = [];  // Tableau pour stocker les cours
  teacherId: string = ''; // ID de l'enseignant

  constructor(private courseService: CourseService, private router: Router) { }

  ngOnInit(): void {
    this.getTeacherCourses();  // Appeler la méthode pour récupérer les cours
  }

  // Méthode pour récupérer l'ID de l'enseignant connecté depuis le localStorage
  getTeacherCourses(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Décoder le token JWT
      this.teacherId = decodedToken.id;  // Récupérer l'ID de l'enseignant à partir du token
      this.fetchCourses();  // Appeler la méthode pour récupérer les cours
    } else {
      this.router.navigate(['/login']); // Si aucun token, rediriger vers la page de login
    }
  }

  // Méthode pour appeler le service et récupérer les cours de l'enseignant
  fetchCourses(): void {
    this.courseService.getCoursesByTeacherId(this.teacherId).subscribe(
      (data: any) => {
        this.courses = data;  // Stocker les cours dans le tableau 'courses'
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des cours', error);
      }
    );
  }

  // Méthode pour rediriger vers la page d'édition du cours
  editCourse(courseId: string): void {
    this.router.navigate([`/edit-course/${courseId}`]);  // Redirige vers la page d'édition du cours
  }

  // Méthode pour supprimer un cours
  deleteCourse(courseId: string): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(courseId).subscribe(
        () => {
          this.courses = this.courses.filter(course => course._id !== courseId);  // Retirer le cours de la liste
        },
        (error) => {
          console.error('Erreur lors de la suppression du cours', error);
        }
      );
    }
  }

  // Méthode pour rediriger vers la page de détails du cours
  viewCourseDetails(courseId: string): void {
    this.router.navigate([`/detailsCours/${courseId}`]);  // Redirige vers la page de détails
  }

}
