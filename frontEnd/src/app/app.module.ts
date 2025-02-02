import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';


import { ProfileComponent } from './component/profile/profile.component';

import { CommonModule } from '@angular/common';
import { InfoComponent } from './component/info/info.component';
import { AddCourseComponent } from './component/course/add-course/add-course.component';
import { ListCourseComponent } from './component/course/list-course/list-course.component';
import { AddTeacherComponent } from './component/teacher/add-teacher/add-teacher.component';
import { ListeTeacherComponent } from './component/teacher/liste-teacher/liste-teacher.component';
import { AddStudentComponent } from './component/student/add-student/add-student.component';
import { ListStudentComponent } from './component/student/list-student/list-student.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,


    ProfileComponent,

    AppComponent,
    SignupComponent,
    InfoComponent,
    AddCourseComponent,
    ListCourseComponent,
    AddTeacherComponent,
    ListeTeacherComponent,
    AddStudentComponent,
    ListStudentComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,




  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
