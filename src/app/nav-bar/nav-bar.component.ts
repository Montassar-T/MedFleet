import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NotifcationsService } from '../services/notifcations.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
url!:any;

  @Input() hide!:boolean;
  @Input() under:boolean = false;
  @Output() change = new EventEmitter();
  @Output() changeX = new EventEmitter();
  user!: any;
id!:any;
  @Input() notifs!: any[];

 @Input() nb = 0;
  constructor(private authService : AuthService , private notif : NotifcationsService , private router :Router , private token : TokenService , private tokenService: TokenService ){

  }


navy(id:any){
   this.router.navigate([`/vehicles/${id}/global`])


}

deleteNotif(id:any){
 
    this.notif.deleteN(id)
      .subscribe(
        () => {
          console.log('Notification deleted successfully');
          this.notif.getAll().subscribe(
            data => {
              this.notifs = data.reverse();
              this.nb = this.notifs.filter(n => n.checked === 0).length; 
              
            },
            error => {
              console.error('Error fetching notifications:', error); 
            }
          );
        },
        (error) => {
          console.error('Failed to delete notification:', error);
        }
      );
     
    
  
}
nav(){
/*
  this.router.navigate(['/settings'])
  */
}

getU() {
  this.authService.getUser(this.id).subscribe(
    (data) => {
      this.user = data;
      this.url = this.user.url; // Assuming 'url' is the property that stores the profile picture URL

      console.log(this.user);
      console.log(this.url)
    },
    (error) => {
      console.error('Error fetching user:', error);
    }
  );
}


  toggleUnder(){
    this.under = !this.under
  }
show(){
  
 this.change.emit()

 


}
showX(){
  
 this.changeX.emit()

 


}
 timeAgo(timestamp: number): string {
  const currentDate = new Date();
  const targetDate = new Date(timestamp);

  // Calculate the difference in milliseconds
  const difference = currentDate.getTime() - targetDate.getTime();

  // Convert milliseconds to seconds, minutes, hours, days
  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return `Il y a quelques secondes`;
  }
}

checkAll(){
  if(this.nb>0){

  
  this.notif.check().subscribe(
    response => {
  
      this.notif.getAll().subscribe(
        data => {
          this.notifs = data.reverse();
          this.nb = this.notifs.filter(n => n.checked === 0).length; // Calculate the number of unchecked notifications
        
        },
        error => {
          console.error('Error fetching notifications:', error); // Log the error if getAll fails
          // Handle error cases in your application
        }
      );
    },
    error => {
      console.error('Error checking notifications:', error); // Log the error
    }  )
  }

}
  ngOnInit(): void {
    this.id = this.token.getUserId()
    this.getU();


    this.authService.changeData$.subscribe(() => {
      this.getU();
    });
  
this.fetchNotifications()
    this.notif.changeNotification$.subscribe(() => {
      this.fetchNotifications();
    });

  }
  fetchNotifications() {
    this.notif.getAll().subscribe((notifications) => {
      this.notifs = notifications.reverse();
      this.nb = this.notifs.filter(n => n.checked === 0).length; // Calculate the number of unchecked notifications

    });
  }


  logout(): void {
    this.tokenService.clearToken();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
