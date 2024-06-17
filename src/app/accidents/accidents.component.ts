import { Component } from '@angular/core';
import { Accident } from '../model/accident';
import { BaseEntityVehComponent } from '../shared/base4veh';
import { ActivatedRoute } from '@angular/router';
import { AccidentService } from '../services/accident.service';

@Component({
  selector: 'app-accidents',
  templateUrl: './accidents.component.html',
  styleUrls: ['./accidents.component.css']
})
export class AccidentsComponent extends BaseEntityVehComponent<Accident> {

  new: Accident = new Accident();
  

  
  constructor(private accidentService : AccidentService , private route : ActivatedRoute ){
    super(accidentService)
  }
  initNew(){
    this.new = new Accident(); 
  }



  
  ngOnInit(): void {
    this.vehicleId = parseInt(this.route.parent?.snapshot.paramMap.get('id') ?? '');
    this.updateVehicleEntities(this.vehicleId);
    }
  
 
  

}
