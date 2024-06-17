// base-entity.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { GenericDataService } from '../services/generic-data.service';
import { Identifiable } from '../model/identifiable.model';
import { ActivatedRoute } from '@angular/router';
import { NotifcationsService } from '../services/notifcations.service';

@Component({
  template: '',
})
export abstract class BaseEntityComponent<T extends Identifiable> implements OnInit {
  entities!: T[];
  filtered!: T[];


  constructor(private dataService: GenericDataService<T> ) {}

  ngOnInit(): void {
    this.updateEntities();
   
  }

  addNew(data: T): void {
    this.dataService.add(data).subscribe(() => {
      this.updateEntities();
      this.initNew();
    });
  }

  modifEntity(data: T): void {
    this.dataService.modif(data);

   
  }

  deleteEntity(entity: T): void {
    this.dataService.deleteById((entity as any).id).subscribe(() => {
      this.entities = this.entities.filter((e) => (e as any).id !== (entity as any).id);
      this.updateFiltered();
    });
  }

  updateEntities(): void {

    this.dataService.getAll().subscribe((data) => {
      this.entities = data.sort((a, b) => (a as any).id - (b as any).id);
      this.updateFiltered();
    });
  }

  updateVehicleEntities(id :any){
    this.dataService.getAllForVeh(id).subscribe((data) => {
      this.entities = data.sort((a, b) => (a as any).id - (b as any).id);
      this.updateFiltered();
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
