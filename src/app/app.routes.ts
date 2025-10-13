import { Routes } from '@angular/router'
import { AppComponent } from './app.component'
import { AdminComponent } from './admin/admin.component'

import { MainPageComponent } from './pages/main/main.component'
import { ReservationPageComponent } from './pages/reservation/reservation.component'
import { ColaComponent } from './admin/cola/cola.component'
import { MapaAdminComponent } from './admin/mapa/mapa.component'
import { FamilyListComponent } from './admin/family-list/family-list.component'

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'cola',
        component: ColaComponent,
      },
      {
        path: 'mapa',
        component: MapaAdminComponent,
      },
      {
        path: 'familias',
        component: FamilyListComponent,
      },
      {
        path: '**',
        redirectTo: 'familias',
      },
    ],
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
