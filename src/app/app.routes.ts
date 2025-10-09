import { Routes } from '@angular/router'
import { AppComponent } from './app.component'
import { AdminComponent } from './admin/admin.component'

import { MainPageComponent } from './pages/main/main.component'
import { ReservationPageComponent } from './pages/reservation/reservation.component'
import { ColaComponent } from './admin/cola/cola.component'

export const routes: Routes = [
  {
    path: 'admin/cola',
    component: ColaComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
  },
  {
    path: 'reserva/:id',
    component: ReservationPageComponent,
  },
  {
    path: ':id',
    component: MainPageComponent,
  },
  {
    path: '**',
    component: AppComponent,
  },
]
