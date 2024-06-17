import { Injectable } from '@angular/core';
import { Repair } from '../model/repair';
import { GenericDataService } from './generic-data.service';

@Injectable({
  providedIn: 'root'
})
export class RepairService  extends GenericDataService<Repair> {

  apiUrl= "http://localhost:3000/vehDetails/repairs";
}
