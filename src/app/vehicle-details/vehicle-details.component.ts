import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss']
})
export class VehicleDetailsComponent implements OnInit {
  isClassToggled: boolean = false;

constructor(private _activatedRoute : ActivatedRoute , private _router: Router){}

  public vehicleId!:number;

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.vehicleId = parseInt(id || '0', 10);
    });
  }

  navigateToGlobal(): void {
    this._router.navigate(['/vehicles', this.vehicleId, 'global']);
  }



  toggleMe() {
    this.isClassToggled = !this.isClassToggled;
  }
  
}
