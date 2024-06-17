import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ResetComponent } from './reset/reset.component';
import { IdentifyComponent } from './identify/identify.component';
import { VerifyComponent } from './verify/verify.component';
import { MenuComponent } from './menu/menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { MissionsComponent } from './missions/missions.component';
import { DriversComponent } from './drivers/drivers.component';
import { StaticsComponent } from './statics/statics.component';
import { SettingsComponent } from './settings/settings.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';
import { GlobalComponent } from './global/global.component';
import { ConsumptionComponent } from './consumption/consumption.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { RepairsComponent } from './repairs/repairs.component';
import { AccidentsComponent } from './accidents/accidents.component';
import { AuthGuard} from './guard/auth.guard';
import { LoggedGuard } from './guard/logged.guard';
import { ResetGuard } from './guard/reset.guard';
import { codeGuard } from './guard/code.guard';
import { EmailGuard } from './guard/email.guard';
import { confirmedCodeGuard } from './guard/confirmed-code.guard';

const routes: Routes = [
  {path:'login' , component: LoginComponent , canActivate: [LoggedGuard]},
  {path:'sign-up' , component: SignInComponent, canActivate: [LoggedGuard]},
  {path:'password/identify' , component: IdentifyComponent, canActivate: [LoggedGuard, EmailGuard]},
  {path:'password/verify' , component: VerifyComponent, canActivate: [LoggedGuard ,ResetGuard, codeGuard , confirmedCodeGuard]},
  {path:'password/reset' , component: ResetComponent, canActivate: [LoggedGuard,ResetGuard]},
  {path:'dashboard' , component:DashboardComponent , canActivate: [AuthGuard]},
  {path:'vehicles' , component:VehiclesComponent, canActivate: [AuthGuard]},
  {path:'vehicles/:id' , component:VehicleDetailsComponent,
  children : [
    {path:'global' , component: GlobalComponent},
    {path:'consumption' , component: ConsumptionComponent},
    {path:'maintenance' , component: MaintenanceComponent},
    {path:'repairs' , component: RepairsComponent},
    {path:'accidents' , component: AccidentsComponent},
    {path:'' ,redirectTo:'global', pathMatch:'full'}
  ]
  , canActivate: [AuthGuard]},
  {path:'missions' , component:MissionsComponent, canActivate: [AuthGuard]},
  {path:'drivers' , component:DriversComponent, canActivate: [AuthGuard]},
  {path:'statics' , component:StaticsComponent, canActivate: [AuthGuard]},
  {path:'settings' , component:SettingsComponent, canActivate: [AuthGuard]},
  {path:'nav-bar' , component:NavBarComponent},
  {path:'' , redirectTo : '/login' , pathMatch:'full'},
  {path:'**' , redirectTo : '/login' , pathMatch:'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const componentList = [
  LoginComponent,
  SignInComponent,
  ResetComponent,
  IdentifyComponent,
  VerifyComponent,
  DashboardComponent,
  MenuComponent,
  VehiclesComponent,
  MissionsComponent,
  DriversComponent,
  StaticsComponent,
  SettingsComponent,
  NavBarComponent,
  VehicleDetailsComponent,
  GlobalComponent,
  ConsumptionComponent,
  MaintenanceComponent,
  RepairsComponent,
  AccidentsComponent
]