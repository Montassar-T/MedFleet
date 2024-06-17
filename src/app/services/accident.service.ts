import { Injectable } from '@angular/core';
import { Accident } from '../model/accident';
import { GenericDataService } from './generic-data.service';

@Injectable({
  providedIn: 'root'
})
export class AccidentService extends GenericDataService<Accident> {




  apiUrl= "http://localhost:3000/vehDetails/accidents";

}
