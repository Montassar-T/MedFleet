import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';;
import { AuthService } from '../services/auth.service';
import { RecoveryService } from '../services/recovery.service';
import { ResetService } from '../services/reset.service';


@Component({
  selector: 'app-identify',
  templateUrl: './identify.component.html',
  styleUrls: ['./identify.component.scss',]
})
export class IdentifyComponent implements OnInit {

  isLoading: boolean = false;

Form !: FormGroup;
exists!:boolean;


constructor( private recoveryService :RecoveryService ,  private formBuilder :FormBuilder , private router :Router, private resetService : ResetService  ){}


identify() {
  if (this.Form.valid) {
    const email = this.Form.get('email')?.value;
    this.isLoading = true;
    this.recoveryService.getUserByEmail(email).subscribe(
      (data) => {
        this.exists = true;
        this.router.navigate(['/password/verify']);
      },
      (error) => {
        this.exists = false;
      }
    ).add(() => {
      this.isLoading = false; 
    });
  }
}
touched(){
  if(!this.exists){
    this.exists = true;

  }
}
/*54155299*/


  ngOnInit(){
    this.initForm() 
  }

  initForm(){
    this.Form = this.formBuilder.group({
      email:['', [Validators.required , Validators.email]]
    })
  }


  get email(){return this.Form.get('email')}
}
