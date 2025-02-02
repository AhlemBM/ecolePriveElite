import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/users/user.service";


@Component({
  selector: 'app-list-student',
  templateUrl: './list-student.component.html',
  styleUrls: ['./list-student.component.css']
})
export class ListStudentComponent implements OnInit {
  students: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  // Charger la liste des étudiants
  loadStudents() {
    this.userService.getAllStudents().subscribe(
      (data) => {
        this.students = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des étudiants', error);
      }
    );
  }

  // Supprimer un étudiant
  deleteStudent(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cet étudiant ?')) {
      this.userService.deleteUser(id).subscribe(
        () => {
          this.students = this.students.filter(student => student._id !== id);
        },
        (error) => {
          console.error('Erreur lors de la suppression', error);
        }
      );
    }
  }
}
