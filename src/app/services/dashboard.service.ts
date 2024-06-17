import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  userId:any;
  constructor(protected http: HttpClient, private token :TokenService) {
    this.userId = this.token.getUserId();
 }

  apiUrl= "http://localhost:3000/dashboard";

  getNumberOfMissions(year : any , m : any): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/${this.userId}/nbM/${year}/${m}`);
  }
  getTotal(entity: string ,year : any , m : any): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/${this.userId}/${entity}/${year}/${m}`);
  }


  hors():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/hors/${this.userId}`);
  }




}
