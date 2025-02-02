import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/users/user.service";


@Component({
  selector: 'app-liste-teacher',
  templateUrl: './liste-teacher.component.html',
  styleUrls: ['./liste-teacher.component.css']
})
export class ListeTeacherComponent implements OnInit {
  teachers: any[] = [];

  constructor(private teacherService: UserService) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  // Charger la liste des enseignants
  loadTeachers() {
    this.teacherService.getAllTeachers().subscribe(
      (data) => {
        this.teachers = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des enseignants', error);
      }
    );
  }

  // Supprimer un enseignant
  deleteTeacher(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cet enseignant ?')) {
      this.teacherService.deleteTeacher(id).subscribe(
        () => {
          this.teachers = this.teachers.filter(teacher => teacher._id !== id);
        },
        (error) => {
          console.error('Erreur lors de la suppression', error);
        }
      );
    }
  }
}
