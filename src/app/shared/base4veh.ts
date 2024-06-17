
// base-entity.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { GenericDataService } from '../services/generic-data.service';
import { Identifiable } from '../model/identifiable.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  template: '',
})
export abstract class BaseEntityVehComponent<T extends Identifiable> {
  entities!: T[];
  filtered!: T[];
  id!:any;
  vehicleId!: number;

  constructor(private dataService: GenericDataService<T> ) {}
 addNew(data: any): void {
    data.veh_id = this.vehicleId;


    this.dataService.addForVeh(data).subscribe(
      (response) => {
        this.updateVehicleEntities(this.vehicleId);
        this.initNew(); 
      },
      (error) => {
        console.error('Error adding consumption:', error);
      }
    );
  }
  modifEntity(entity: T): void {
    this.dataService.modif(entity);
  }

  deleteEntity(entity: T): void {
    this.dataService.deleteById((entity as any).id).subscribe(() => {
      this.entities = this.entities.filter((e) => (e as any).id !== (entity as any).id);
      this.updateFiltered();
    });
  }


  updateVehicleEntities(id: any) {
    this.dataService.getAllForVeh(id).subscribe((data) => {
      if (data) {
        this.entities = data;
        this.updateFiltered();
      } else {
        console.error('Data is null or undefined');
      }
    });
  }
  
  updateFiltered(): void {
    this.filtered = this.entities.slice(0,10);
  }

  deleteTab(data:any): void {
    this.dataService.deleteTable(data).subscribe(
      () => {
        this.entities = this.entities.filter(entity => ! data.includes(entity.id));
        this.updateFiltered()
        
      }
    );
   
  }

  abstract initNew():void;
}
