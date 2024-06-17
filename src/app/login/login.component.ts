import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from '../services/token.service';
import { HttpClient } from '@angular/common/http';
 declare const google: any; // Declare Google variable

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  invalid: boolean = false;
  hide = true;

  constructor(private authService: AuthService, private router: Router , private formBuilder : FormBuilder ,private tokenService :TokenService , private http : HttpClient) {}
  show(){
    this.hide = !this.hide;
    }

    touch(){
      this.invalid = false;
    }
  
  login() {
    console.log('clicked')
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      this.authService.login(email, password).subscribe(
        (data) => {
          // Successful login
          this.tokenService.setToken( data.token.token);
          this.tokenService.setUserId(data.token.userId);
          // Redirect to dashboard or desired page
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          // Failed login
          console.error('Login failed:', error);
          if(error.error.message ==="Invalid data"){
            this.invalid = true;
          }
          // Handle error, show error message to user, etc.
        }
      );
    }  
  }
  sendTokenToServer(tokenId: string) {
    this.authService.loginWithGoogle(tokenId)
    .subscribe(
        (response) => {
          this.tokenService.setToken( response.token.token);
          this.authService.picture = response.picture;
          this.tokenService.setUserId(response.token.userId);
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Token verification error:', error);
          // Handle the error from the server, e.g., show error message to user
        }
      );
  }
  ngOnInit() {

    google.accounts.id.initialize({
      client_id: '903178606296-okr46g353c0rhtb756875v66l0kn4tgn.apps.googleusercontent.com',
      callback: (response: any) => {
        if (response.error) {
          console.error('Google Sign-In error:', response.error);
        } else {
          this.sendTokenToServer(response.credential);
          // Handle successful sign-in, e.g., send token to backend for verification
        }
      }
    });
    google.accounts.id.renderButton(
      document.getElementById('google-login-button'),
      { theme: 'outline', size: 'large' }
    );
    
   this.initForm()
  }
  
  initForm(){
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
     
  }
 

  get email(){return this.loginForm.get('email')}
  get password(){return this.loginForm.get('password')}

}
