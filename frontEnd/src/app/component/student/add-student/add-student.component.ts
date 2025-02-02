import { Component } from '@angular/core';

import { Router } from '@angular/router';
import {UserService} from "../../../services/users/user.service";

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent {
  student: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: 'male',
    address: '',
    tel: '',
    role: 'student'
  };

  selectedAvatar: File | null = null;
  selectedCv: File | null = null;
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onFileSelected(event: any, fileType: 'avatar' | 'cv') {
    const file = event.target.files[0];
    if (fileType === 'avatar') {
      this.selectedAvatar = file;
    } else if (fileType === 'cv') {
      this.selectedCv = file;
    }
  }

  addStudent() {
    const formData = new FormData();
    Object.keys(this.student).forEach(key => {
      formData.append(key, this.student[key]);
    });

    if (this.selectedAvatar) {
      formData.append('img', this.selectedAvatar);
    }
    if (this.selectedCv) {
      formData.append('doc', this.selectedCv);
    }

    this.userService.addStudent(formData).subscribe(
      response => {
        alert('Student added successfully!');
        this.router.navigate(['/listStudent']); // Redirection après ajout
      },
      error => {
        console.error('Error adding student:', error);
        this.errorMessage = 'Failed to add student. Please try again.';
      }
    );
  }
}
