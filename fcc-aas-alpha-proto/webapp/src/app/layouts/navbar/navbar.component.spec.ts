import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from "@angular/router/testing";
import { AuthService } from 'src/app/core/auth/auth.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: AuthService; 

  const mockAuth = {
    isAuthenticated: () => jest.fn(),
    signIn: () => jest.fn(),
    signOut: () => jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule, 
        RouterTestingModule
      ],
      declarations: [ 
        NavbarComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], 
      providers: [
        {provide: AuthService, useValue: mockAuth}, 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    authService = TestBed.inject(AuthService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    jest.resetAllMocks();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call auth service to sign in', () => {
    jest.spyOn(authService, 'signIn');
    component.signIn(); 
    expect(authService.signIn).toBeCalled();
  });

  it('should sign out, and user is unauthenticated', () => {
    jest.spyOn(authService, 'signOut');
    component.signOut();
    expect(authService.signOut).toBeCalled();
  });

  it('should call the auth service for authentication status', () => {
    jest.spyOn(authService, 'isAuthenticated');
    component.isAuthenticated();
    expect(authService.isAuthenticated).toBeCalled();
  })
});