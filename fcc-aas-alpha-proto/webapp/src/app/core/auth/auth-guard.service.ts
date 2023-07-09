import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from './auth.service';

/**
 * @whatItDoes Checks if user is authenticated (required) and has required authorities to access the route (optional).
 *
 * @howToUse
 * REQUIRED: Add route guard to `canActivate` property of a route.
 *
 * ```
 *      canActivate: [AuthGuard] // required
 * ```
 *
 * OPTIONAL: Add `a` to route data.  Must be a list of strings.  Providing no roles effectively
 * means that any role can access the route (given all other requirements have been met).
 * ```
 *       {
 *         path: 'example/path',
 *         component: ExampleComponent,
 *         data: {
 *           authorities: ['Supervisor'] // optional
 *         },
 *         canActivate: [AuthGuard]  // checks if authenticated and if has roles listed above
 *       }
 * ```
 *
 * @export
 * @class AuthGuard
 * @implements {CanActivate}
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(resolve => {
      this.authService.getAuthenticationState().subscribe(authUser => {
        if (!authUser) {
          this.router.navigate(['/403']);
          return resolve(false);
        }

        const requiredRoles = route.data.authorities;
        if (!requiredRoles || requiredRoles.length === 0) {
          return resolve(true);
        } else {
          resolve(this.userHasRequiredRoles(requiredRoles, authUser));
        }
      });
    });
  }

  private userHasRequiredRoles(requiredRoles: any, authUser: User): boolean {
    const roles = authUser.authorities;
    if (!roles || roles.length === 0) {
      this.router.navigate(['/403']);
      return false;
    }
    const granted: boolean = requiredRoles.some((role: string) => roles.includes(role) as boolean);
    if (!granted) {
      this.router.navigate(['/403']);
    }
    return granted;
  }
}
