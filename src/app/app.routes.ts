import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';
import {CanActivatePromotionGuard} from "./home/canActivatePromotionGuard.service";



export const ROUTES: Routes = [
  { path: '',      component: HomeComponent},
  { path: '**',    component: HomeComponent}
];
