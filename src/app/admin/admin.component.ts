import { Component, OnInit } from '@angular/core'
import { FamilyService } from '../shared/family.service'
import { AppService } from '../shared/app.service'
import { environment } from '../../environments/environment'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { MapComponent } from '../theater/map/map.component'
import { preventaAvailable } from '../constants'
import { TailwindClassDirective } from '../shared/directives/tailwind-class.directive'
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MapComponent,
    TailwindClassDirective,
    RouterModule,
    HttpClientModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  theatreIsOpen: boolean | null = null
  showMap = false
  preventa = preventaAvailable
  constructor(
    private familyService: FamilyService,
    private appService: AppService,
  ) {
    this.familyService.fetchStageMap()
  }

  async toggleChange() {
    await this.appService.changeAvailability()
  }

  ngOnInit(): void {
    this.familyService.listenIfTheatreIsOpen()
    this.appService.theatreIsOpen$.subscribe((response) => {
      if (response !== null) {
        this.theatreIsOpen = !!response
      }
    })
  }

  resetApp() {
    this.appService.resetApp()
  }

  downloadReport() {
    this.familyService.downloadReport('reporte.csv', 'text/plain')
  }

  uploadNewFamilies() {
    this.familyService.uploadAllFamilies()
  }
}
