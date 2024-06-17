import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class NotifcationsService {

  userId!:any;
  private changeSubject = new Subject<void>();


  constructor(private http : HttpClient , private token : TokenService) {
    this.userId = this.token.getUserId()

   }
   get changeNotification$() {
    return this.changeSubject.asObservable();
  }

  notifyChange() {
    this.changeSubject.next();
  }


  apiUrl ="http://localhost:3000/vehicles"
   changed(){
    console.log("chaaaaaaaaaaaanged")
   }

  getAll(){
    return this.http.get<any[]>(`${this.apiUrl}/notif/${this.userId}`)
  }

  check(){
    return this.http.post(`${this.apiUrl}/notif/${this.userId}`,{})
  }

  deleteN(nid:number){
    return this.http.delete(`${this.apiUrl}/notif/${nid}/${this.userId}`)

  }
}
