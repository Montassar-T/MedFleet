import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators , FormBuilder , FormGroup } from '@angular/forms';
import { RecoveryService } from '../services/recovery.service';
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  verifForm!: FormGroup;
  invalid!: boolean;  


  constructor(private recoveryService:RecoveryService,private router:Router , private formBuilder : FormBuilder){}


  verify(){
    console.log(this.code?.value)
    if(this.code?.value == this.recoveryService.getRecoveryCode()){

      this.recoveryService.matchy();

      this.router.navigate(['/password/reset'])
    }else{
      this.invalid = true;
    }
    
    
  }

  touched(){
    if(this.invalid){
      this.invalid = false;
    }
  }


  ngOnInit(): void {
    this.initForm();
  }
initForm(){
  this.verifForm = this.formBuilder.group({
    code : ['',[Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  })

}

get code(){return this.verifForm.get('code')}

  
}
