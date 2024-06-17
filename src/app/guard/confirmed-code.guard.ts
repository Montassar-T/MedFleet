import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RecoveryService } from '../services/recovery.service';

@Injectable({
  providedIn: 'root',
})
export class confirmedCodeGuard implements CanActivate {
  constructor(private router: Router, private recoveryService: RecoveryService) {}

  canActivate(): boolean {
    if (this.recoveryService.getMatchy()) {
      this.recoveryService.resetCode();
      this.recoveryService.resetEmail();
      this.recoveryService.resetMatchy();
      this.router.navigate(['/login']);
      
      return false;
    } else {
      return true;
    }
  }
}
