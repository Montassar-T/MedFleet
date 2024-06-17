import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';import { TokenService } from '../services/token.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
url!:any;

    user!: any;
  touched= false;
    cancel = true;
    same = true;
    passForm!: FormGroup;
    profilForm!: FormGroup;
    hide= true;
    emptyPass:boolean = true;
    nonIdent = false;
id!:any;
    constructor(private authService : AuthService , private formBuilder :FormBuilder , private router :Router , private token : TokenService){}

 

  annulerChangePass(){    
    this.profilForm.get('ConfirmPassword')?.setErrors(null);
    this.profilForm.get('password')?.setErrors(null);
  }
  
    show(){
      this.hide = !this.hide;
    }


    cancelUpdate(){
      this.initForm()
      this.initSecondForm()
    }

    touch(){
      this.touched = true;
      const name = this.profilForm.get('name')?.value
      const email = this.profilForm.get('email')?.value
      const org = this.profilForm.get('organization')?.value
      const pass = this.passForm.get('password')?.value 
     
      if( pass?.length != 0){
        this.emptyPass = false;
      }
      if( name != this.user.username   || email != this.user.email ||  org != this.user.organization ){
     this.same = false;
    
      }
      else if( name == this.user.username   && email == this.user.email && org == this.user.organization ){
     this.same = true;
    
      }

    }



    update(){
      console.log("clicked")
      const name = this.profilForm.get('name')?.value
      const email = this.profilForm.get('email')?.value
      const org = this.profilForm.get('organization')?.value
      const pass = this.passForm.get('password')?.value
      if(!this.same){
        this.authService.UpdateProfil(name , org , email  , this.user.id).subscribe(
          (data)=> {
            this.initForm(); // Call initForm() inside the subscription callback
            this.initSecondForm(); 
            this.authService.change()
        
          }
        )
      }
    if( this.same && !this.emptyPass ){
      this.authService.UpdatePass(pass , this.user.id).subscribe(
        (data)=> {
          this.initForm(); // Call initForm() inside the subscription callback
          this.initSecondForm(); 
          this.authService.change()

        }
      )
    }

     if( !this.same && !this.emptyPass){
        this.authService.UpdateUser(name , org , email , pass , this.user.id).subscribe(
          (data)=> {
            this.initForm(); // Call initForm() inside the subscription callback
            this.initSecondForm(); 
            this.authService.change()

          }
        )
      }
      
     
    }
   


    getU() {
  this.authService.getUser(this.id).subscribe(
    (data) => {
      this.user = data;
      this.url= this.user.url
      this.initForm(); // Call initForm() inside the subscription callback
      this.initSecondForm(); // Call initForm() inside the subscription callback
     
    }
  );
}


initForm() {
    this.profilForm = this.formBuilder.group({
      name: [this.user.username, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      organization: [this.user.organization, Validators.required],
     
    });
    this.same = true;

}
initSecondForm() {
    this.passForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
     
    });
    this.emptyPass = true;

}
deleteAccount(){
  const  userConfirme = window.confirm("Êtes-vous sûr de supprimer ce compte ?'");
  if( userConfirme){
    this.authService.deleteAccount(this.id).subscribe(
      res => {
       this.token.clearToken();
       this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
      
      }
    )
  }
  
}
    ngOnInit(): void {
      this.id = this.token.getUserId()
      this.getU();
   this.authService.changeData$.subscribe(() => {
      this.getU();
    });
  
    
    }

    get name(){return this.profilForm.get('name')}
  get organization(){return this.profilForm.get('organization')}
   get email(){return this.profilForm.get('email')}
  get password(){return this.passForm.get('password')}
  get Confpassword(){return this.passForm.get('ConfirmPassword')}


}
