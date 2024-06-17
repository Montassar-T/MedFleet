import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from '../model/vehicle.model';
import { VehicleService } from '../services/vehicle.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-global',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.scss']
})
export class GlobalComponent implements OnInit {
last!:any;
  id!: number;
  vehicle!: Vehicle;
  changed:boolean = false;
  form!:FormGroup
  same = true;
  k!:any;
  constructor(private _router: Router,private activatedRoute: ActivatedRoute , private vehicleService :VehicleService ,private fb : FormBuilder) { }



  change(){
    this.changed = true;
    this.same = this.form.get('marque')?.value === this.vehicle.marque &&
                 this.form.get('type')?.value === this.vehicle.type &&
                 this.form.get('imma')?.value === this.vehicle.imma &&
                 this.form.get('statue')?.value === this.vehicle.statue &&
                 this.form.get('kilometrageAct')?.value === this.vehicle.kilometrageAct;

    
  
  }

  save(){
    if (this.form.valid ) {
      let formData = this.form.value;
      formData.id = this.vehicle.id
      this.vehicleService.modif(this.form.value);
      this.changed = false;
    }
  }
  
  ngOnInit() {
 
    
    this.activatedRoute.parent?.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam !== null ? parseInt(idParam) : 0;
    });
    this.vehicleService.get(this.id).subscribe(data => {
      this.vehicle = data
      this.initForm()
      
    });

    this.vehicleService.lastE(this.id).subscribe(
      data =>{
        this.k =data.kilo;
      }
    )

  }
  
  initForm(){
    this.form= this.fb.group({
      marque :[ this.vehicle.marque , Validators.required],
      type :[ this.vehicle.type , Validators.required],
      imma :[ this.vehicle.imma , Validators.required],
      statue : [this.vehicle.statue , Validators.required],
      kilometrageAct :[this.vehicle.kilometrageAct , Validators.required],

    })
    
  }


navigate(){
this.changed = false;
this.initForm()  }

}
