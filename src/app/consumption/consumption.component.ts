import { Component, OnInit } from '@angular/core';
import { Consumption } from '../model/consumption';
import {  } from '../services/maintenance.service';
import { BaseEntityComponent } from '../shared/base';
import { ActivatedRoute } from '@angular/router';
import { BaseEntityVehComponent } from '../shared/base4veh';
import { ConsumptionService } from '../services/consumption.service';

@Component({
  selector: 'app-consumption',
  templateUrl: './consumption.component.html',
  styleUrls: ['./consumption.component.css']
})
export class ConsumptionComponent extends BaseEntityVehComponent<Consumption> {
  
  new: Consumption = new Consumption();
  override vehicleId!: number;

  constructor(private consumptionService : ConsumptionService   , private route : ActivatedRoute  ){
    super(consumptionService )
  }


  ngOnInit(): void {
    this.vehicleId = parseInt(this.route.parent?.snapshot.paramMap.get('id') ?? '');
    this.updateVehicleEntities(this.vehicleId);
    }
  
  initNew(){
    this.new = new Consumption(); 
  }
  
  
}
