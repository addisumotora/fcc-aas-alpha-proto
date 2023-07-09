jest.mock('src/app/core/auth/auth.service');

import { Component, ElementRef, ViewChild } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { HasAnyAuthorityDirective } from './has-any-authority.directive';
import { AuthService } from './auth.service';

@Component({
  template: ` <div *aasHasAnyAuthority="'ROLE_ADMIN'" #content></div> `,
})
class TestHasAnyAuthorityDirectiveComponent {
  @ViewChild('content', { static: false })
  content?: ElementRef;
}

describe('HasAnyAuthorityDirective tests', () => {
  let mockAuthService: AuthService;
  const authenticationState = new Subject<User | null>();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HasAnyAuthorityDirective, TestHasAnyAuthorityDirectiveComponent],
      providers: [AuthService],
    });
  }));

  beforeEach(() => {
    mockAuthService = TestBed.inject(AuthService);
    mockAuthService.getAuthenticationState = jest.fn(() => authenticationState.asObservable());
  });

  describe('set aasHasAnyAuthority', () => {
    it('should show restricted content to user if user has required role', () => {
      mockAuthService.aasHasAnyAuthority = jest.fn(() => true);
      const fixture = TestBed.createComponent(TestHasAnyAuthorityDirectiveComponent);
      const comp = fixture.componentInstance;

      fixture.detectChanges();

      expect(comp.content).toBeDefined();
    });

    it('should not show restricted content to user if user has not required role', () => {
      mockAuthService.aasHasAnyAuthority = jest.fn(() => false);
      const fixture = TestBed.createComponent(TestHasAnyAuthorityDirectiveComponent);
      const comp = fixture.componentInstance;

      fixture.detectChanges();

      expect(comp.content).toBeUndefined();
    });
  });

  describe('change authorities', () => {
    it('should show or not show restricted content correctly if user authorities are changing', () => {
      // GIVEN
      mockAuthService.aasHasAnyAuthority = jest.fn(() => true);
      const fixture = TestBed.createComponent(TestHasAnyAuthorityDirectiveComponent);
      const comp = fixture.componentInstance;

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(comp.content).toBeDefined();

      // GIVEN
      mockAuthService.aasHasAnyAuthority = jest.fn(() => false);

      // WHEN
      authenticationState.next(null);
      fixture.detectChanges();

      // THEN
      expect(comp.content).toBeUndefined();

      // GIVEN
      mockAuthService.aasHasAnyAuthority = jest.fn(() => true);

      // WHEN
      authenticationState.next(null);
      fixture.detectChanges();

      // THEN
      expect(comp.content).toBeDefined();
    });
  });
});
