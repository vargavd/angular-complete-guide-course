import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    router: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean | UrlTree> {
    // so here user returns an observable with a generic type of User - but we need an observable with boolean
    return this.authService.user.pipe(
      take(1), // this will take the latest user value and then unsubscribe
      map(user => {
      const isAuth = !!user;
      if (isAuth) {
        return true;
      }

      return this.router.createUrlTree(['/auth']); // this will redirect to /auth if user is not authenticated
    }));
  }
}