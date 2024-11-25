import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { isPlatformBrowser, Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private static isButtonPressed = false;
  private readonly platformID = inject(PLATFORM_ID);
  constructor(private router: Router, private location: Location) {}
  canActivate(
    route: ActivatedRouteSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (isPlatformBrowser(this.platformID)) {
      this.location.replaceState('');
      const currentUrl = route.url.join('/');
      if (
        AuthGuard.isButtonPressed ||
        this.isRefreshedPage(currentUrl) ||
        !sessionStorage.getItem('lastAccessedRoute')
      ) {
        AuthGuard.isButtonPressed = false;
        this.storeLastAccessedRoute(currentUrl);
        return true;
      }
      return this.router.navigate(
        [sessionStorage.getItem('lastAccessedRoute')],
        {
          skipLocationChange: true,
        }
      );
    } else return false;
  }

  private isRefreshedPage(currentUrl: string): boolean {
    const lastAccessedRoute = sessionStorage.getItem('lastAccessedRoute');
    return lastAccessedRoute === currentUrl;
  }

  private storeLastAccessedRoute(currentUrl: string): void {
    sessionStorage.setItem('lastAccessedRoute', currentUrl);
  }

  public static AccessUrlNavigation(): void {
    AuthGuard.isButtonPressed = true;
  }
}
