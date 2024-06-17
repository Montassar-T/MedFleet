import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecoveryService {

  private apiUrl: string = 'http://localhost:3000';
  private recoveryCode!: string; // Property to store the recovery code
  private UserEmail: string = '';
  sent : boolean = false;
  match : boolean = false;

  constructor(private http: HttpClient) { }

  getUserByEmail(email: string): Observable<void> {
    return this.http.get<any>(`${this.apiUrl}/users/verify?email=${email}`).pipe(
      map(response => {
        if (response && response.message && response.message.startsWith('Verification code sent successfully')) {
          this.recoveryCode = response.message.split(': ')[1];
          this.UserEmail = email
          this.sent = true; // Set email sent flag to true


        } else {
          throw new Error('Failed to retrieve verification code');
        }
      }),
      catchError(error => {
        console.error('Error fetching verification code:', error);
        throw new Error('Failed to retrieve verification code');
      })
    );
  }

  matchy(){
    this.match = true;
  }
  getMatchy(){
    return this.match;
  }
  isEmailSent(){
    return this.sent;
  }
  getCode(){
    return this.recoveryCode;
  }
  getEmail(){
    return this.UserEmail;
  }

  reset(){
    this.resetEmail();
    this.resetCode();
    this.resetMatchy();

  }
  resetEmail(){
    this.UserEmail="";
  }
  resetMatchy(){
    this.match = false  }
  resetCode(){
    this.recoveryCode="";
  }
  getRecoveryCode(): string {
    return this.recoveryCode;
  }

  

  resetPassword(pass : string): Observable<any>{
   this.reset()
  const email = this.UserEmail;

    return this.http.post<any>(`${this.apiUrl}/reset/pass`, {pass, email})

  }
  loginAfterRest(pass : string): Observable<any>{
  const email = this.UserEmail;
    return this.http.post<any>(`${this.apiUrl}/reset/pass`, {pass, email})

  }

}
