import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertifyLeftComponent } from './certify-left.component';

describe('CertifyLeftComponent', () => {
  let component: CertifyLeftComponent;
  let fixture: ComponentFixture<CertifyLeftComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertifyLeftComponent]
    });
    fixture = TestBed.createComponent(CertifyLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
