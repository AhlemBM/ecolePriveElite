import { Component } from '@angular/core';

import { Router } from '@angular/router';
import {UserService} from "../../../services/users/user.service";

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.css']
})
export class AddTeacherComponent {
  teacher: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: 'male',
    address: '',
    tel: '',
    role: 'teacher'
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

  addTeacher() {
    const formData = new FormData();
    Object.keys(this.teacher).forEach(key => {
      formData.append(key, this.teacher[key]);
    });

    if (this.selectedAvatar) {
      formData.append('img', this.selectedAvatar);
    }
    if (this.selectedCv) {
      formData.append('doc', this.selectedCv);
    }

    this.userService.addTeacher(formData).subscribe(
      response => {
        alert('Teacher added successfully!');
        this.router.navigate(['/listTeacher']); // 🔥 Redirection après ajout
      },
      error => {
        console.error('Error adding teacher:', error);
        this.errorMessage = 'Failed to add teacher. Please try again.';
      }
    );
  }
}
