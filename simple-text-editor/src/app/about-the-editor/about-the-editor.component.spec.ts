import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTheEditorComponent } from './about-the-editor.component';

describe('AboutTheEditorComponent', () => {
  let component: AboutTheEditorComponent;
  let fixture: ComponentFixture<AboutTheEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutTheEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutTheEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
