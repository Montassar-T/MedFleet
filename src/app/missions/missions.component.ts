import { Component, OnInit } from '@angular/core';
import { BaseEntityComponent } from '../shared/base';
import { Mission } from '../model/mission.model';
import { MissionService } from '../services/mission.service';
import { GenericDataService } from '../services/generic-data.service';
import { Vehicle } from '../model/vehicle.model';
import { VehicleService } from '../services/vehicle.service';
import { Driver } from '../model/driver.model';
import { DriverService } from '../services/driver.service';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.scss']
})
export class MissionsComponent extends BaseEntityComponent<Mission>{
  veh!: Vehicle[];
  dri!: Driver[];

  new: Mission= new Mission()
  constructor(private missionService : MissionService , private vehicleService : VehicleService , private driverService : DriverService){
    super(missionService);
   
  }


  override ngOnInit(): void {
    this.updateEntities();
    this.vehicleService.getAll().subscribe(
      (data) =>{
        this.veh = data;
      }
    
    )
    this.driverService.getAll().subscribe(
      (data) =>{
        this.dri = data;
      }
    )

  }


  
   
  initNew(){
    this.new = new Mission(); 
  }
 

}
