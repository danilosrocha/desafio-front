import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class JwtGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot,): boolean {
    const hasValidToken = this.checkToken();

    const isPrivate = next.data["isPrivate"] || false;

    if (!hasValidToken && isPrivate) {
      this.router.navigate(['/login']);
      return false;
    }

    if (hasValidToken && !isPrivate) {
      this.router.navigate(['']);
      return false
    }

    return true
  }

  private checkToken(): boolean {
    const token = localStorage.getItem('token');

    return !!token;
  }
}
