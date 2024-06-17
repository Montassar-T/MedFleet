import { Injectable } from '@angular/core';
import { Consumption } from '../model/consumption';
import { Vehicle } from '../model/vehicle.model';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { GenericDataService } from './generic-data.service';
import { Maintenance } from '../model/maintenance';


@Injectable({
  providedIn: 'root'
})
export class MaintenanceService extends GenericDataService<Maintenance> {


     apiUrl= "http://localhost:3000/vehDetails/maintenance";



  

}
