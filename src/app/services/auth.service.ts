import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { User } from '../model/user.model';
import { Subject } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private changeSubject = new Subject<void>();

  public picture!:any;

  
  protected userId!: any;

  private apiUrl: string = 'http://localhost:3000'; // Replace this with your backend API URL





  constructor(private http: HttpClient , private token : TokenService) {
     this.userId = this.token.getUserId();
  }
  loginWithGoogle(tokenId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/login`, { tokenId });
  }
  signupWithGoogle(tokenId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/signup`, { tokenId });
  }


  get changeData$() {
    return this.changeSubject.asObservable();
  }
  
  deleteAccount(id :any){
    return this.http.delete(`${this.apiUrl}/accountDelete/${id}`)
  }
  change() {
    this.changeSubject.next();
  }
  UpdateUser(name:any , organization:any ,email: any, password: any , userId : number){
    return this.http.post(`${this.apiUrl}/users/update` , {name , organization , email , password , userId})
  }
  activateAccount(token: string) {
    // Send HTTP request to backend to activate account
    return this.http.post(`${this.apiUrl}/api/activate`, { token });
  }



  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password });
  }

  
    UpdateProfil(name:any , organization:any ,email: any, userId : number){
      return this.http.post(`${this.apiUrl}/users/update/profil` , {name , organization , email  , userId})
    }
  
    UpdatePass( password: any , userId : number){
      return this.http.post(`${this.apiUrl}/users/update/pass` , {password, userId})

    }
  signUp(name:string , organization:string ,email: string, password: string): Observable<any> {
    // Send a POST request to your backend API to create a new user
    return this.http.post<any>(`${this.apiUrl}/auth/signup`, {name , organization , email , password});
  }


  getUser(id:any){
    return this.http.get(`${this.apiUrl}/users/${id}`)
  }
  
  
 
}
