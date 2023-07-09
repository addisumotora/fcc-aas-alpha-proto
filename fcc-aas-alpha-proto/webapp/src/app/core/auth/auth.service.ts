import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { catchError, from, Observable, of, ReplaySubject, shareReplay, tap } from 'rxjs';
import { AmplifyHubService } from './amplify-hub.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState = new ReplaySubject<User | null>(1);
  private accountCache$?: Observable<User | null>;
  private authUser: User | null = null;

  constructor(private amplifyHub: AmplifyHubService) {
    this.amplifyHub.authEvent.subscribe(() => this.identity());
  }

  signIn(): void {
    Auth.federatedSignIn();
  }

  signOut(): Promise<any> {
    return Auth.signOut().then(() => {
      this.authState.next(null);
    });
  }

  isAuthenticated(): boolean {
    return this.authUser !== null;
  }

  aasHasAnyAuthority(authorities: string[] | string): boolean {
    if (!this.authUser?.authorities) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    const roles = this.authUser.authorities;
    return roles.some((authority: string) => authorities.includes(authority));
  }

  identity(force?: boolean): Observable<User | null> {
    if (!this.accountCache$ || force || !this.isAuthenticated()) {
      this.accountCache$ = this.getUser().pipe(
        catchError(() => of(null)),
        tap((account: User | null) => {
          this.setAuthentication(account);
        }),
        shareReplay()
      );
    }
    return this.accountCache$.pipe(catchError(() => of(null)));
  }

  getAuthenticationState(): Observable<User | null> {
    return this.authState.asObservable();
  }

  getToken(resolve: (token: string | undefined) => void): void {
    Auth.currentSession()
      .then(auth => {
        const jwt = auth.getIdToken().getJwtToken();
        return resolve(jwt);
      })
      .catch(() => resolve('failure'));
  }

  private setAuthentication(authUser: User | null): void {
    this.authUser = authUser;

    this.authState.next(this.authUser);
    if (!authUser) {
      this.accountCache$ = undefined;
    }
  }

  private getUser(): Observable<User> {
    return from(
      Auth.currentAuthenticatedUser().then((data: any) => {
        const idTokenPayload = data.signInUserSession.idToken.payload;
        return new User(idTokenPayload);
      })
    );
  }
}
