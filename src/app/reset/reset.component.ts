import { Component , OnInit} from '@angular/core';
import { Validators , FormBuilder , FormGroup } from '@angular/forms';
import { RecoveryService } from '../services/recovery.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent {

  resetForm!: FormGroup;
  hide = true;

  constructor(private recoveryService:RecoveryService,private router:Router , private formBuilder : FormBuilder){}

  show(){
    this.hide = !this.hide;
  }
  
reset(){
  const pass = this.resetForm.get('mdp')?.value
  this.recoveryService.resetPassword(pass).subscribe(
    (data)=>{
      this.router.navigate(['/login'])
    },
    (error)=>{
    }

  )
}


  ngOnInit(): void {
    this.initForm();
  }
initForm(){
  this.resetForm = this.formBuilder.group({
    mdp : ['' , [Validators.required , Validators.minLength(6)] ]
  })
}


get mdp(){return this.resetForm.get('mdp')}


}