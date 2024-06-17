import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../services/token.service';
declare const google: any; 

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  signUpForm!: FormGroup;
  exists:boolean = false;
  hide = true;
  constructor(private authService: AuthService , private formBuilder: FormBuilder, private router:Router , private httpClient: HttpClient , private tokenService :TokenService) {}

  show(){
    this.hide = !this.hide;
  }

 

  signUp() {
    if (this.signUpForm.valid) {
      const email = this.signUpForm.get('email')?.value;
      const password = this.signUpForm.get('password')?.value;
      const name = this.signUpForm.get('name')?.value; 
      const organization = this.signUpForm.get('organization')?.value;
  
      this.authService.signUp(name, organization, email, password).subscribe(
        (data) => {          
          this.loginAfterSignup(email, password);
        },
        (error) => {
          if (error.error.message === 'Email already exists') {
            this.exists = true; 
          }
        }
      );
    }
  }
  
  loginAfterSignup(email: string, password: string) {
    this.authService.login(email, password).subscribe(
      (data) => {
        // Successful login after signup
        localStorage.setItem('access_token', data.token);
        this.router.navigate(['/dashboard']);

      },
      (error) => {
     
        // Handle error, show error message to user, etc.
      }
    );
  }
  sendTokenToServer(tokenId: string) {
   
    this.authService.signupWithGoogle(tokenId)
      .subscribe(
        (response) => {
          this.tokenService.setToken( response.token.token);
          this.tokenService.setUserId(response.token.userId);
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Token verification error:', error);
          // Handle the error from the server
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
          // Handle successful sign-in, e.g., send token to backend for verification
          this.sendTokenToServer(response.credential);
        }
      }
    });
  
    google.accounts.id.renderButton(
      document.getElementById('g_id_signup'),
      { theme: 'outline', size: 'large' }
    );
    this.initForm()
   }
 
 
 
   initForm(){
     this.signUpForm = this.formBuilder.group({
       name: ['', [Validators.required]],
       email: ['', [Validators.required, Validators.email]],
       organization: ['', Validators.required],
       password: ['', [Validators.required, Validators.minLength(6)]]
     })
   }

   get name(){return this.signUpForm.get('name')}
  get organization(){return this.signUpForm.get('organization')}
   get email(){return this.signUpForm.get('email')}
  get password(){return this.signUpForm.get('password')}

}
