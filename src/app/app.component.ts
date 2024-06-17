import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NotifcationsService } from './services/notifcations.service';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'MedFleet';
  x  = true ;
  y  = false ;
  isLoggedIn!: Boolean;

  notifs!:any[];
nb!:any;
  constructor(public authService: AuthService , private notif : NotifcationsService , public tokenService:TokenService ){
  }

  c(x:any){
    this.x = !this.x;
    if(this.y == true){
      this.y = false
    }
   
   
  }
  xyz(y:any){
    this.y = !this.y;
    if(this.x == false){
      this.x = true
    }
   
  }
  handleClick() {
    if(this.x == false){
   
    this.x = !this.x;
    
  }
  if(this.y == true){
    this.y = !this.y;
 
  }
  
 


}
 
changed(){

  this.notif.getAll().subscribe(
    data => {
      this.notifs = data.reverse();
      this.nb = this.notifs.filter(n => n.checked === 0).length; // Calculate the number of unchecked notifications

    }
  )
  
}
  ngOnInit(): void {
    this.isLoggedIn= this.tokenService.isAuthenticated();
    
   
  }
  
}
