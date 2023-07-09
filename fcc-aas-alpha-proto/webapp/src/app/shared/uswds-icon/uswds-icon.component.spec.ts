import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UswdsIconComponent } from './uswds-icon.component';

describe('UswdsIconComponent', () => {
  let component: UswdsIconComponent;
  let fixture: ComponentFixture<UswdsIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UswdsIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UswdsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should create with a minimum size of 2', () => {
      // GIVEN
      component.size = 1;

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.size).toEqual(2);
    });

    it('should create with a maximum size of 9', () => {
      // GIVEN
      component.size = 12;

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.size).toEqual(9);
    });
  });
});
