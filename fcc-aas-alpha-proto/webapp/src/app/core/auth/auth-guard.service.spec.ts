import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthGuard } from './auth-guard.service';
import { MockRouter } from '../mocks/router.mock';
import { of } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from './auth.service';

describe('AuthGuard ', () => {
  let service: AuthGuard;
  let mockRouter: Router;
  let mockAuth: any = {
    getAuthenticationState: jest.fn()
  };

  const forbiddenPage = ['/403'];
  const requiredRoles: string[] = [];
  const state = {
    root: {
      queryParams: 'test',
    },
    url: 'test',
  } as any as RouterStateSnapshot;
  const route = {
    data: {
      authorities: requiredRoles,
    },
  } as any as ActivatedRouteSnapshot;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: AuthService, useValue: mockAuth },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(AuthGuard);
    mockRouter = TestBed.inject(Router);
    mockAuth = TestBed.inject(AuthService);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(service).toBeDefined();
  });

  describe('canActivate, if not authenticated', () => {
    it('should route EXTERNAL user to sign-in page', fakeAsync(() => {
      
      jest.spyOn(mockAuth, 'getAuthenticationState').mockImplementation(jest.fn(() => of(null)))
      service.canActivate(route, state);
      
      tick();
      expect(mockRouter.navigate).toHaveBeenCalledWith(forbiddenPage);
    }));
  });

  describe('isAccessAllowed, if authenticated', () => {
    const mockUser: User = {
      firstName: 'John',
      lastName: 'Doe',
      authorities: [],
      email: 'test@tmail.com',
      username: 'test'
    } 
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('with no authorities specified on route', () => {

      it('should allow access', fakeAsync(() => {
        jest.spyOn(mockAuth, 'getAuthenticationState').mockImplementation(jest.fn(() => of(mockUser)))
        const response = service.canActivate(route, state);
        tick();

        expect(response).resolves.toBe(true);
        expect(mockRouter.navigate).not.toBeCalled();
      }));
    });

    describe('with authorities specified on route', () => {
      beforeEach(() => {
        route.data.authorities = ['FCC_Test'];
      })
      afterEach(() => {
        jest.clearAllMocks();
      });
      it('should deny access, if user has zero roles', fakeAsync(() => {
        jest.spyOn(mockAuth, 'getAuthenticationState').mockImplementation(jest.fn(() => of(mockUser)))
        const response = service.canActivate(route, state);

        expect(response).resolves.toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(forbiddenPage);
        tick();
      }));
      it('should allow user access, if they have required roles', fakeAsync(() => {
        mockUser.authorities = ['FCC_Test'];
        jest.spyOn(mockAuth, 'getAuthenticationState').mockImplementation(jest.fn(() => of(mockUser)))
        const response = service.canActivate(route, state);

        expect(response).resolves.toBe(true);
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        tick();
      }));
      it('should deny user access, if they have roles, but not the required roles', fakeAsync(() => {
        mockUser.authorities = ['FCC_WrongRole'];
        jest.spyOn(mockAuth, 'getAuthenticationState').mockImplementation(jest.fn(() => of(mockUser)))
        const response = service.canActivate(route, state);

        expect(response).resolves.toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(forbiddenPage);
        tick();        
      }))
    });
  });
});
