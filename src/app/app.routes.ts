import { Routes } from '@angular/router';
import { FundosListComponent } from './features/fundos/fundos-list/fundos-list';

export const routes: Routes = [
  { path: '', component: FundosListComponent },
  { path: '**', redirectTo: '' },
];
