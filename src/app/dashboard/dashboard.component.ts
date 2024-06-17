import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { MissionService } from '../services/mission.service';
import { ConsumptionService } from '../services/consumption.service';
import { DashboardService } from '../services/dashboard.service';
import { VehicleService } from '../services/vehicle.service';
import { TokenService } from '../services/token.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public line: any;
  public pie: any;
  missions!:any[];
  consumptions!:any[];
  labels : string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  newValue!: any ;
  oldValue!: number ;
  percentageDifference!: any
  ttC!:any;
  ttCO!:any;
  prTtc!:any;
  ttM!:any;
  ttMO!:any;
  prTtm!:any;
  ttr!:any;
  ttro!:any;
  prTtr!:any;
  hors!:any;
  nbCars!:any;
  s:number =0;
  monthTotals: number[] = [];

  constructor(private missionService : MissionService , private consumptionService : ConsumptionService , private dash : DashboardService ,  private veh  :VehicleService,private tokenService :TokenService){}



  createChart(){
    this.line = new Chart( "line" , {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
         label:"Consommation mensuelle du carburant en Dinar",
          data: this.monthTotals,
          borderColor: '#353535',
          backgroundColor: 'rgba(173,216,230,0.2)',
          tension:0.4,
          pointBackgroundColor:'#4B8790',
          borderWidth:2,
          pointBorderColor :'#4B8790',

        }],
      },
      options: {
      responsive: true,
        
        aspectRatio:3,
        plugins: {
          legend: {
              display: false,
              labels: {
                  color: 'rgb(255, 99, 132)',
             
              }
          }
      }
        
        
      },
    });

    this.pie = new Chart("pie", {
      type: "doughnut",
      data: {
        datasets: [{
          data: [ this.s , 100-this.s],
          backgroundColor: [
            '#4B8790',
            'rgb(255 , 255, 255)'
          ],
          hoverBackgroundColor: [
            '#4B8790',
            'rgb(255 , 255, 255)'

          ],
          hoverBorderColor: [
            '#4B8790',
            'rgb(255 , 255, 255)'

          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio:1.5,
        animation:{
          animateScale:true,
          animateRotate:true
        },
        cutout:"85%",
        
        plugins: {
          tooltip: {
            enabled: false, 
          },
        
      
         
        },
        
      
      }
    });
    

   
  }
  pr(newValue: number, oldValue: number): number {
    if (oldValue !== 0) {
      return ((newValue - oldValue) / oldValue) * 100;
    } else {
      if (newValue !== 0) {
        return 100; 
      } else {
        return 0; 
      }
    }
  }
  /*

  pre(x:any){
    if(x > 0){
      return '+'+x
    }else if (x<0){

      return '-'+x
    }else{
      return x
    }
  }
  */
  ngOnInit(): void {
    let m = new Date().getMonth()+1
    let y = new Date().getFullYear()
    let n:any;
    let z:any;
    if(m>=2){
      n = m-1
      z = y;
    }else{
      n= 11
      z= y-1
    }



    for (let i = 1; i <= m; i++) {
  
      this.dash.getTotal('consumptions', y, i).subscribe(
        (result) => {
          this.monthTotals[i - 1] = result.count;
        },
        (error) => {
          console.error('Error fetching total consumption:', error);
        }
      );
    }
    this.veh.getAll().subscribe(
      (data) => {
        this.nbCars = data.length;
        this.dash.hors().subscribe(
          (v) => {
            this.hors = v.count
            this.s = (this.hors /this.nbCars )*100 || 0
            
            
            
            this.createChart();
          }
        )
      }
    )
   
    this.dash.getTotal('consumptions',y , m).subscribe(
      (nb) => {
        this.ttC = nb.count
        this.dash.getTotal('consumptions',z,n).subscribe(
          (x) => {
            this.ttCO = x.count
          
            this.prTtc = this.pr(this.ttC , this.ttCO)
          }
        )
      }
    )
    this.dash.getTotal('repairs',y , m).subscribe(
      (nb) => {
        this.ttr = nb.count
        this.dash.getTotal('repairs',z,n).subscribe(
          (x) => {
            this.ttro = x.count
            this.prTtr = this.pr(this.ttr, this.ttro)
          }
        )
      }
    )
    this.dash.getTotal('maintenance',y , m).subscribe(
      (nb) => {
        this.ttM = nb.count
        this.dash.getTotal('maintenance',z,n).subscribe(
          (x) => {
            this.ttMO = x.count
            
           
            this.prTtm = this.pr(this.ttM , this.ttMO)

          }
        )
      }
    )





  
   

    
    this.dash.getNumberOfMissions(y,m).subscribe(
      (nb) => {
        this.newValue = nb.count;
        this.dash.getNumberOfMissions(z,n).subscribe(
          (nb) => {
            this.oldValue = nb.count;
            this.percentageDifference = this.pr(this.newValue , this.oldValue)
  
          }
  
     
        )
      }
    )
   this.missionService.getAll().subscribe(
      (miss) => {
    

        this.missions = miss.slice(-2).reverse();
      }
      
      
    )
   

    
  }
}
