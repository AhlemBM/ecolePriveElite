import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {SignupService} from "../../services/users/signup.service";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


  signupForm: FormGroup = this.fb.group({  // Initialisation directe dans la déclaration
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    role: ['', Validators.required],
    gender: ['', Validators.required],
    address: ['', [Validators.required, Validators.minLength(3)]],
    tel: ['', Validators.required],
    childTel: [''],        // Champ conditionnel pour le rôle parent
    speciality: [''],      // Champ conditionnel pour le rôle enseignant
  });

  msgError: string = '';
  page: string = 'Sign Up';

  constructor(private fb: FormBuilder, private authService: SignupService, private router: Router) {}

  ngOnInit(): void {}

  signupOrEdit() {
    if (this.signupForm.valid) {
      const userData = this.signupForm.value;
      this.authService.signup(userData).subscribe(
        response => {
          this.router.navigate(['/login']);
        },
        error => {
          this.msgError = error.error.msg;
        }
      );
    } else {
      this.msgError = 'Please fill in all required fields';
    }
  }
}
