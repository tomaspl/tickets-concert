import { Component, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FamilyService } from '../../shared/family.service'
import { Subscription, combineLatest, interval } from 'rxjs'
import { MapComponent } from '../../theater/map/map.component'

@Component({
  selector: 'app-mapa-admin',
  standalone: true,
  imports: [CommonModule, MapComponent],
  template: `<div class="mx-auto max-w-6xl mt-4 pt-4">
    <app-map />
  </div>`,
})
export class MapaAdminComponent {}
