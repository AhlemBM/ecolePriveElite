import { Component, OnInit } from '@angular/core';
import {CourseService} from "../../../services/course/course.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-details-cours',
  templateUrl: './details-cours.component.html',
  styleUrls: ['./details-cours.component.css']
})
export class DetailsCoursComponent implements OnInit {

  course: any;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourseDetails(courseId);
    }
  }

  loadCourseDetails(courseId: string) {
    this.courseService.getCourseById(courseId).subscribe(
      (course) => {
        this.course = course;
        // Ajouter les champs nécessaires pour la gestion de l'édition
        this.course.students.forEach((student: any) => {
          student.newGrade = student.grade || 0;
          student.newEvaluation = student.evaluation || '';
          student.isEditing = false;
        });
      },
      (error) => console.error('Error fetching course details', error)
    );
  }

  editStudent(student: any) {
    student.isEditing = true;
  }

  cancelEdit(student: any) {
    student.isEditing = false;
    student.newGrade = student.grade || 0;
    student.newEvaluation = student.evaluation || '';
  }

  saveGradeAndEvaluation(student: any) {
    if (student.newGrade < 0 || student.newGrade > 20) {
      alert('Please enter a valid grade (0-20).');
      return;
    }

    this.courseService.updateGradeAndEvaluation(this.course._id, student.studentId._id, student.newGrade, student.newEvaluation).subscribe(
      (response) => {
        alert('Grade and evaluation updated successfully.');
        student.grade = student.newGrade;
        student.evaluation = student.newEvaluation;
        student.isEditing = false;
      },
      (error) => console.error('Error updating grade and evaluation', error)
    );
  }
}
