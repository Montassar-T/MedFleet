import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Identifiable } from '../model/identifiable.model';
import { GenericDataService } from '../services/generic-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from '../model/vehicle.model';
import { Driver } from '../model/driver.model';
import { Mission } from '../model/mission.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver'; // Import saveAs for file download
import * as XLSX from 'xlsx';
import { Consumption } from '../model/consumption';
import { NotifcationsService } from '../services/notifcations.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent<T>  implements OnInit{
  form!: FormGroup;



  @Input() entities!: any[];
  @Input() filtered!: any[];
  @Input() columns!: string[];
  @Input() columnMapping: { [key: string]: string } = {};
  @Input() new: any = {};
  @Input() isVeh!: boolean;
  @Input() veh!: Vehicle[];
  @Input() dri!: Driver[];
  @Input() acc= false;
  @Input() miss= false;
  @Input() type!:string;
  @Output() onEdit = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  @Output() onSave = new EventEmitter();
  @Output() onAdd = new EventEmitter<any>();
  @Output() all = new EventEmitter();

  @Output() changed = new EventEmitter;
  allChecked:boolean = false;
  ids:any[] = [];
  editingIndex :number = -1;
  isAddingNew: boolean = false;
  text:string = '';
  index:number = 10;
  x:boolean = false;
  invalid!: boolean;
  k!:any;
  

  constructor(private _router : Router , private fb: FormBuilder,private route : ActivatedRoute ,private notif: NotifcationsService){}



  ngOnInit() {
    this.initForm();
  
  }

  initForm(initialValues: any = {}) {
    const formConfig: { [key: string]: any } = {};
    this.columns.forEach(column => {
      if (column == 'cout' ) {
        formConfig[column] = [
          initialValues[column] || '',
          [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$'), Validators.pattern('\\S+')]
        
        ];
      }else if (column =="kilo"  || column =="kilometrageAct"){
        formConfig[column] = [
          initialValues[column] || '',
          [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$'),Validators.pattern('^[^\\s]+$')]
        
        ];

      } else {
        formConfig[column] = [initialValues[column] || '', Validators.required];
      }
    });
  
    // Initialize the 'statue' control with the 'statue' value from initialValues
    formConfig['statue'] = [initialValues['statue'] || 'true', Validators.required];
  
    if(this.type ==='repairs' ||this.type==='maintenance'){
      formConfig['veh_id'] = [  parseInt(this.route.parent?.snapshot.paramMap.get('id') ?? '')
    ];

    }
    if (initialValues.hasOwnProperty('date')) {
      // Extract the date part from the ISO 8601 format
      const dateValue = new Date(initialValues['date']);
      const dateFormatted = dateValue.toISOString().split('T')[0];
      formConfig['date'] = [dateFormatted, Validators.required];
    }
    this.form = this.fb.group(formConfig);
  }
  
  exportToExcel() {
    try {
      const fileName = this.type+'.xlsx';
  
      // Map the column names to the ones specified in columnMapping if available
      const header = this.columns.map(col => this.columnMapping[col] || col);
  
      // Map the data using columnMapping to ensure correct order and naming
      const data = this.entities.map(entity => this.columns.map(col => entity[col]));
  
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([header, ...data]);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
      // Write the workbook to an Excel file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  }
  
  deleteEntity(entity : any){
    this.ids = []
    this.allChecked = false;
    const  userConfirme = window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?'");
    if( userConfirme){
      this.onDelete.emit(entity)

    }
  }
  isEmpty(): boolean {
    const hasTrueStatue = (arr: any[]): boolean => arr.some(item => item.statue === 'true');
    return !hasTrueStatue(this.veh) || !hasTrueStatue(this.dri);
  }
  
cancel(){
  this.isAddingNew = false ;
  this.invalid = false;
  this.initForm(); 
}

  dAll(){
    const  userConfirme = window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?'");
    if( userConfirme){
      this.all.emit(this.ids)
    }
    this.allChecked = false;
    this.ids= []
  
  
  }
  addNew() {
    if (this.form.valid) {
        const formData = this.form.value;
        this.onAdd.emit(formData);
        this.isAddingNew = false;
      this.invalid= false
        this.initForm(); // Optionally reset the form after successful submission
    }else{
      this.invalid = true;
    }
}



  toggleSelectionAll(){
    this.editingIndex = -1;
    this.isAddingNew = false;

    if(this.allChecked){
      this.ids = [];
      
    }else{
      this.filtered.forEach(vehicle => {
        const index = this.ids.indexOf(vehicle.id);
        if (index === -1) {
          this.ids.push(vehicle.id);
        }
       
      });
    }
    this.allChecked = !this.allChecked; 
   
  }
  
  toggleSelection(e : any)
  {
   
    
    let index = this.ids.indexOf(e.id)
    this.isAddingNew = false;
    if(index == -1){
      this.ids.push(e.id);
    }else{
      this.ids.splice(index,1);
      this.editingIndex = -1;
    }
    this.allChecked = this.ids.length == this.filtered.length;
   if(this.ids.length>1){
    this.editingIndex = -1;
   }
  
  }



  editEntity(entity: any, index: number) {
    console.log(entity);
    this.editingIndex = index;
    for (let key in entity) {
      this.new[key] = entity[key];
    }
    if (this.ids.indexOf(entity.id) == -1) {
      this.ids.push(entity.id);
    }
    // Initialize the form with the entity's values
    this.initForm(entity);
    
  }

  updateFiltered() {
    if (this.text.length === 0) {
      this.filtered = this.entities.slice(this.index - 10, this.index);
    } else {
      const lower = this.text.toLowerCase();
      this.filtered = this.entities.filter(ent =>
        
        (ent.type?.toLowerCase() ?? '').includes(lower) ||
        (ent.marque?.toLowerCase() ?? '').includes(lower) ||
        ((ent.imma ?? '').toLowerCase().replace(/\s/g, '').includes(lower)) ||
        (ent.nom?.toLowerCase() ?? '').includes(lower) ||
        (ent.prenom?.toLowerCase() ?? '').includes(lower) ||
        (ent.classement?.toLowerCase() ?? '').includes(lower) ||
        (ent.dest?.toLowerCase() ?? '').includes(lower) ||
        (ent.vehicle_immatricule?.toLowerCase() ?? '').includes(lower) ||
        (ent.driver_nom?.toLowerCase() ?? '').includes(lower) ||
        (ent.numCarte?.toLowerCase() ?? '').includes(lower) ||
        (ent.type?.toLowerCase() ?? '').includes(lower) 
        
      ).slice(this.index - 10, this.index);
    }
  }
  

  setAdding(){
    this.isAddingNew = true;
    this.editingIndex = -1;
    this.allChecked = false;
    this.ids = []

    if(this.filtered.length == 10){
      this.filtered.pop()
    }
  }
  

  increIndex(){
    this.ids = []
    this.allChecked = false;
    this.index +=10;
    this.editingIndex = -1;
    this.updateFiltered();
  }
  decreIndex(){
    this.ids = []
    this.allChecked = false;
    while(this.index !== 10){
    this.index -=10;
    this.editingIndex = -1;
    this.updateFiltered();
  }
  }
  modifier(v: any) {
    this.ids = [];
    if (this.form.valid) {
      const formData = this.form.value;
      formData.id = v.id; // Include the 'id' from 'v' in the form data
      
      // Check if the form data and 'v' have the same values for each attribute
      let sameValues = true;
      for (let key in formData) {
        if (formData[key] !== v[key]) {
          sameValues = false;
          break;
        }
      }
  
      if (!sameValues) {
        this.onSave.emit(formData); 
        this.changed.emit()
        this.notif.notifyChange(); // Notify NotificationsService about the change

        for (let key in formData) {
          v[key] = formData[key];
        }
      }
      this.editingIndex = -1;
  
      
    } 
  }
  
  
  

  
  annuler(){
    this.editingIndex= -1
    this.ids = []
    
  }

  setX(bool: boolean){
    this.x = bool;
    
  }
  onSelectVeh(v : any){
    this._router.navigate(['/vehicles', v.id]);
  }

  isDisabled(v:any) : boolean{
    return (this.ids.length>0 && ! this.ids.includes(v.id)) || this.ids.length >1 || this.isAddingNew
  }


  
  
}
