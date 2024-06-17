import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

constructor(private authService : AuthService, private router:Router , private tokenService : TokenService){}


logout(): void {
  this.tokenService.clearToken();
  this.router.navigate(['/login']).then(() => {
    window.location.reload();
  });
}


}
