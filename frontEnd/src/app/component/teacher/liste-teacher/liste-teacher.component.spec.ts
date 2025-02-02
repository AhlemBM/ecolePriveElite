import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeTeacherComponent } from './liste-teacher.component';

describe('ListeTeacherComponent', () => {
  let component: ListeTeacherComponent;
  let fixture: ComponentFixture<ListeTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeTeacherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
