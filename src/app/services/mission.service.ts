import { Injectable } from '@angular/core';
import { Mission } from '../model/mission.model';
import { GenericDataService } from './generic-data.service';

@Injectable({
  providedIn: 'root'
})
export class MissionService extends GenericDataService<Mission>{
  apiUrl ="http://localhost:3000/missions"

  

  

  numberOfMission(){
    return this.http.get<any>(`${this.apiUrl}/total`)
  }
  
}
