import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectReports } from './project-reports';

describe('ProjectReports', () => {
  let component: ProjectReports;
  let fixture: ComponentFixture<ProjectReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectReports],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
