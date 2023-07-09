jest.mock('@angular/router');
jest.mock('aws-amplify');
import { Router } from '@angular/router';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AmplifyHubService } from './amplify-hub.service';
import { of } from 'rxjs';
import { Auth } from 'aws-amplify';
import { ID_TOKEN_MOCK } from '../mocks/id-token.model.mock';
import { MockRouter } from '../mocks/router.mock';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  const mockAmplifyHub = {
    authEvent: of(null)
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: AmplifyHubService, useValue: mockAmplifyHub }
      ],
    });
    service = TestBed.inject(AuthService);
    jest.spyOn(Auth, 'federatedSignIn').mockImplementation(jest.fn());
    jest.spyOn(Auth, 'signOut').mockResolvedValue(jest.fn())
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should create', () => {
    expect(service).toBeDefined();
  })

  describe('isAuthenticated', () => {
    it('should return true, if user has signed in', fakeAsync(() => {
      Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => Promise.resolve(ID_TOKEN_MOCK))
      service.identity().subscribe(() => {
        const response = service.isAuthenticated();
        expect(response).toBe(true);
      });
      tick();
    }));

    it('should return false, if user is not signed in', fakeAsync(() => {
      Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => Promise.reject('catchError'));
      service.identity().subscribe(() => {
        const response = service.isAuthenticated();
        expect(response).toBe(false);
      });
      tick();
    }))
  });

  describe('aasHasAnyAuthority', () => {
    describe('aasHasAnyAuthority string parameter', () => {
      it('should return false if user is not logged', () => {
        // authUser is false by default
        const hasAuthority = service.aasHasAnyAuthority(['FCC_Test']);
        expect(hasAuthority).toBe(false);
      });

      it('should return false if user is logged in but no authority', () => {
        Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => Promise.resolve(ID_TOKEN_MOCK));
        service.identity().subscribe(() => {
          const hasAuthority = service.aasHasAnyAuthority(['FCC_Test']);
          expect(hasAuthority).toBe(false);
        });
      });

      it('should return true if user is logged in and has authority', () => {
        ID_TOKEN_MOCK.signInUserSession.idToken.payload['cognito:groups'] = ['FCC_Test'];
        Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => Promise.resolve(ID_TOKEN_MOCK));
        service.identity().subscribe(() => {
          const hasAuthority = service.aasHasAnyAuthority(['FCC_Test']);
          expect(hasAuthority).toBe(true);
        });
      });
      it('should return true if user is logged in and has authority, if authority is not array', () => {
        ID_TOKEN_MOCK.signInUserSession.idToken.payload['cognito:groups'] = ['FCC_Test'];
        Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => Promise.resolve(ID_TOKEN_MOCK));
        service.identity().subscribe(() => {
          const hasAuthority = service.aasHasAnyAuthority('FCC_Test');
          expect(hasAuthority).toBe(true);
        });
      });

    });
    describe('getAuthenticationState', () => {
      it('should provide user if signed in', fakeAsync(() => {
        Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => Promise.resolve(ID_TOKEN_MOCK))
        service.identity().subscribe(() => {
          service.getAuthenticationState().subscribe(response => {
            const payload = ID_TOKEN_MOCK.signInUserSession.idToken.payload;
            const expected = new User(payload);
            expect(response).toStrictEqual(expected);
          }
         );   
        });
        tick();
      }));
      it('should be null if not signed in', fakeAsync(() => {
        // user is unauthenticated by default
        service.getAuthenticationState().subscribe(response => {
          expect(response).toBe(null);
        });   
        tick();
      }));
    })
  });
  describe('signIn', () => {
    it('should call Auth.federatedSignIn', () => {
      service.signIn();
      expect(Auth.federatedSignIn).toBeCalled();
    });
  })

  describe('signOut', () => {
    it('should call Auth.signOut and resolve to null', () => {
      service.signOut();
      expect(Auth.signOut).toBeCalled();
      service.getAuthenticationState().subscribe(response => {
        expect(response).toBe(null);
      });
      
    });
  });

  describe('getToken', () => {
    it('should call Auth.currentSession and resolve to JWT', () => {
      const test = {
        getIdToken() {
          return {
            getJwtToken() {
              return 'test'
            }
          }
        }
      };
      jest.spyOn(Auth, 'currentSession').mockResolvedValue(Promise.resolve(test) as any);
      service.getToken((token: string | undefined) => {
        expect(token).toBe('test');
      });
    });
    it('should call Auth.currentSession and resolve to failure', () => {
      jest.spyOn(Auth, 'currentSession').mockResolvedValue(Promise.reject("error") as any);
      service.getToken((token: string | undefined) => {
        expect(token).toBe('failure');
      });

    })
  })
});
