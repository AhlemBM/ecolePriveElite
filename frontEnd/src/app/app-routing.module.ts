import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { SignupComponent } from './component/signup/signup.component';
import { LoginComponent } from './component/login/login.component';



import { ProfileComponent } from './component/profile/profile.component';
import {AddCourseComponent} from "./component/course/add-course/add-course.component";
import {ListCourseComponent} from "./component/course/list-course/list-course.component";
import {ListStudentComponent} from "./component/student/list-student/list-student.component";
import {AddTeacherComponent} from "./component/teacher/add-teacher/add-teacher.component";
import {AddStudentComponent} from "./component/student/add-student/add-student.component";
import {ListeTeacherComponent} from "./component/teacher/liste-teacher/liste-teacher.component";
import {DetailsCoursComponent} from "./component/course/details-cours/details-cours.component";
import {ListCoursStudentComponent} from "./component/student/list-cours-student/list-cours-student.component";
import {LoginAdminComponent} from "./component/admin/login-admin/login-admin.component";
import {ValidationComponent} from "./component/validation/validation.component";


const routes: Routes = [
  {path:"", component:HomeComponent},

  {path:"signupAdmin", component:SignupComponent},
  {path:"editProfile/:id", component:SignupComponent},
  {path:"signupTeacher", component:SignupComponent},
  {path:"signupStudent", component:SignupComponent},
  {path:"signupParent", component:SignupComponent},
  {path:"signup", component:SignupComponent},
  {path:"profile", component:ProfileComponent},
  {path:"profile/:id", component:ProfileComponent},
  {path:"addCourse", component:AddCourseComponent},
  {path:"courses", component:ListCourseComponent},
  {path:"detailsCours/:id", component:DetailsCoursComponent },

  {path:"login", component:LoginComponent},

  {path:"addCourse", component:AddCourseComponent},
  { path: 'admin-login', component: LoginAdminComponent },
  { path: 'valideListe', component: ValidationComponent },


  // Routes pour les listes
  { path: 'listTeacher', component: ListeTeacherComponent },
  { path: 'listStudent', component: ListStudentComponent },
 /* { path: 'listParent', component: ListParentComponent },*/
  { path: 'listCours', component: ListCoursStudentComponent },
  // Routes pour les ajouts
  { path: 'addTeacher', component: AddTeacherComponent },
  { path: 'addStudent', component: AddStudentComponent },
  /*{ path: 'addParent', component: AddParentComponent },*/
  { path: '**', redirectTo: '' } ,// Redirect unknown routes to the default route

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
