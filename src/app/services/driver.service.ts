import { Injectable } from '@angular/core';
import { GenericDataService } from './generic-data.service';
import { Driver } from '../model/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriverService extends GenericDataService<Driver>{

  apiUrl ="http://localhost:3000/drivers"

}
