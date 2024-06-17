import { Component, OnInit } from '@angular/core';
import { Driver } from '../model/driver.model';
import {  Router } from '@angular/router';
import { DriverService } from '../services/driver.service';
import { GenericDataService } from '../services/generic-data.service';
import { BaseEntityComponent } from '../shared/base';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent extends BaseEntityComponent<Driver>  {
  new: Driver= new Driver
  constructor( private driverService :DriverService){
    super(driverService)
  }
  initNew(){
    this.new = new Driver() 
    this.new.statue = "true"

  }
  
}
