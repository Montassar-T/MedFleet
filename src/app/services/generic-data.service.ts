import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Identifiable } from '../model/identifiable.model';
import { NotifcationsService } from './notifcations.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export abstract class GenericDataService<T extends Identifiable> {


  protected abstract apiUrl :string;
  protected userId!: any;


  constructor(protected http: HttpClient , private notif : NotifcationsService , private token : TokenService) {
    this.userId = this.token.getUserId();

  }






  getAllForVeh(id :any){
    return this.http.get<any[]>(`${this.apiUrl}/${id}?user_id=${this.userId}`)

  }
  addForVeh(data : T){
    return this.http.post(`${this.apiUrl}?user_id=${this.userId}`, data);

  }

  add(entity: T) {
    return this.http.post(`${this.apiUrl}?user_id=${this.userId}`, entity);
  }

  deleteById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}?user_id=${this.userId}`;
    return this.http.delete(url);
  }

  deleteTable(ids: number[]) {
    const deleteRequests = ids.map(id => this.deleteById(id));
    return forkJoin(deleteRequests).pipe(map(() => {}));
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?user_id=${this.userId}`);
  }

  get(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}?user_id=${this.userId}`;
    return this.http.get<any>(url);
  }

  modif(entity: T) {
  
    const updateUrl = `${this.apiUrl}/${entity.id}?user_id=${this.userId}`;
    this.http.put(updateUrl, entity)
    .subscribe(
      (result) => {
        console.log('Entity modification successful:', result);
        this.notif.notifyChange(); // Notify NotificationsService about the change
      },
      (error) => {
        console.error('Error modifying entity:', error);
      }
    );
  }
}

