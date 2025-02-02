import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import {CourseService} from "../../../services/course/course.service";
import {LoginService} from "../../../services/users/login.service";

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {

  addCourseForm!: FormGroup; // Utilisation de l'opérateur `!`
  imagePreview: string | ArrayBuffer | null = null;
  msgImg: string = '';
  msgError: string = '';
  page: string = 'Add Course';
  teacherId: string = '';

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private authService : LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addCourseForm = this.fb.group({
      courseName: ['', [Validators.required]],
      duration: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      avatar: [null]
    });

    this.teacherId = this.authService.getTeacherId();
  }
  // Gérer la sélection de l'image pour le cours
  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Affichage de l'image
        this.msgImg = 'Image selected successfully';
      };
      reader.readAsDataURL(file);
    }
  }

  // Fonction de soumission du formulaire
  addOrEditCourse(): void {
    if (this.addCourseForm.invalid) {
      return;
    }

    const formValue = this.addCourseForm.value;
    const courseData = {
      ...formValue,
      teacherId: this.teacherId,
      avatar: this.imagePreview // Ajout de l'image sélectionnée
    };

    // Appel au service pour ajouter le cours
    this.courseService.addCourse(courseData).subscribe(
      (response) => {
        // Gérer la réponse
        this.router.navigate(['/courses']);  // Rediriger vers la liste des cours ou une autre page
      },
      (error) => {
        this.msgError = 'Failed to add course. Please try again.';
      }
    );
  }

  // Getter pour accéder facilement aux contrôles du formulaire
  get courseName() {
    return this.addCourseForm.get('courseName');
  }

  get duration() {
    return this.addCourseForm.get('duration');
  }

  get description() {
    return this.addCourseForm.get('description');
  }
}
