import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class LoggedGuard implements CanActivate {
  constructor(private router: Router , private token : TokenService) {}

  canActivate(): boolean {
    if (this.token.isAuthenticated()) {
      return false; // Prevent access for logged-in users
      this.router.navigate(['/dashboard']);

    } else {
      return true; // Allow access for non-logged-in users
    }
  }
}
