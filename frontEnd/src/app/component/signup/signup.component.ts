import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {SignupService} from "../../services/users/signup.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: SignupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      childTel: [''],  // Optionnel pour Parent
      speciality: ['']  // Optionnel pour Teacher
    });

    // Dynamique: rendre les champs requis selon le rôle
    this.signupForm.get('role')?.valueChanges.subscribe(role => {
      if (role === 'parent') {
        this.signupForm.get('childTel')?.setValidators([Validators.required]);
      } else {
        this.signupForm.get('childTel')?.clearValidators();
      }

      if (role === 'teacher') {
        this.signupForm.get('speciality')?.setValidators([Validators.required]);
      } else {
        this.signupForm.get('speciality')?.clearValidators();
      }

      this.signupForm.get('childTel')?.updateValueAndValidity();
      this.signupForm.get('speciality')?.updateValueAndValidity();
    });
  }

  onSignup(): void {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe(
        (response) => {
          alert('Signup successful');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error(error);
          alert('Signup failed');
        }
      );
    }
  }
}
