import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../model/vehicle.model';
import * as XLSX from 'xlsx';
import {  Router } from '@angular/router';
import { BaseEntityComponent } from '../shared/base';


@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent extends BaseEntityComponent<Vehicle> {
  
  new: Vehicle = new Vehicle();
 @Input() notifs!:any[];
 @Input() nb!:any[];
  k!:any;

  @Output() x = new EventEmitter()
 
  
  constructor(private vehicleService: VehicleService){
    super(vehicleService)
  }

c(){
  this.x.emit()
}
initNew(){
  this.new = new Vehicle()

    
} 



}
