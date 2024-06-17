import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseEntityVehComponent } from '../shared/base4veh';
import { Maintenance } from '../model/maintenance';
import { MaintenanceService } from '../services/maintenance.service';
@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent extends BaseEntityVehComponent<Maintenance> {

  new: Maintenance = new Maintenance();

  constructor(private maintenanceService : MaintenanceService , private route : ActivatedRoute ){
    super(maintenanceService)
  }
  initNew(){
    this.new = new Maintenance(); 
  }
  ngOnInit(): void {
    this.vehicleId = parseInt(this.route.parent?.snapshot.paramMap.get('id') ?? '');
    this.updateVehicleEntities(this.vehicleId);
    }
}

