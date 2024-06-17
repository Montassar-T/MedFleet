import { Component } from '@angular/core';
import { BaseEntityVehComponent } from '../shared/base4veh';
import { Repair } from '../model/repair';
import { RepairService } from '../services/repair.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-repairs',
  templateUrl: './repairs.component.html',
  styleUrls: ['./repairs.component.css']
})
export class RepairsComponent extends BaseEntityVehComponent<Repair>{


  new: Repair = new Repair();

  constructor(private repairService : RepairService , private route : ActivatedRoute ){
    super(repairService)
  }


  initNew(){
    this.new = new Repair(); 
  }
  
  ngOnInit(): void {
    this.vehicleId = parseInt(this.route.parent?.snapshot.paramMap.get('id') ?? '');

    this.updateVehicleEntities(this.vehicleId);
    }
  
 


}
