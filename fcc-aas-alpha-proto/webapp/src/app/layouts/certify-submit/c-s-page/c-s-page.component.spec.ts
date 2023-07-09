import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CSPageComponent } from './c-s-page.component';

describe('CSPageComponent', () => {
  let component: CSPageComponent;
  let fixture: ComponentFixture<CSPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CSPageComponent]
    });
    fixture = TestBed.createComponent(CSPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
