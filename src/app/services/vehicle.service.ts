import { Injectable } from '@angular/core';
import { Vehicle } from '../model/vehicle.model'
import { GenericDataService } from './generic-data.service';


@Injectable({
  providedIn: 'root'
})
export class VehicleService  extends GenericDataService<Vehicle>{
   apiUrl ="http://localhost:3000/vehicles"
  

     
  lastE(Vid:any){
    return this.http.get<any>(`${this.apiUrl}/entretien/${Vid}/${this.userId}`)

  }



}
