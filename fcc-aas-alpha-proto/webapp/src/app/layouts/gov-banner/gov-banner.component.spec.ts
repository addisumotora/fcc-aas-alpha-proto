const USWDS = {
  accordion: {
    init: jest.fn(),
  },
};
jest.mock('@uswds', () => USWDS);
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovBannerComponent } from './gov-banner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
  
  describe('GovBannerComponent', () => {
    let component: GovBannerComponent;
    let fixture: ComponentFixture<GovBannerComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule],
        declarations: [GovBannerComponent],
        providers: [],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    });
  
    beforeEach(() => {
      fixture = TestBed.createComponent(GovBannerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
  