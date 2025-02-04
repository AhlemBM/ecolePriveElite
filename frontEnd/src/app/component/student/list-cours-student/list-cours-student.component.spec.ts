import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCoursStudentComponent } from './list-cours-student.component';

describe('ListCoursStudentComponent', () => {
  let component: ListCoursStudentComponent;
  let fixture: ComponentFixture<ListCoursStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCoursStudentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCoursStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
