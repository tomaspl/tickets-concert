import { Component, OnInit } from '@angular/core'
import { FamilyService } from '../shared/family.service'
import { AppService } from '../shared/app.service'
import { AuthService } from '../shared/auth.service'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { MapComponent } from '../theater/map/map.component'
import { preventaAvailable } from '../constants'
import { TailwindClassDirective } from '../shared/directives/tailwind-class.directive'
import { Router, RouterModule } from '@angular/router'

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MapComponent,
    TailwindClassDirective,
    RouterModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  theatreIsOpen: boolean | null = null
  showMap = false
  preventa = preventaAvailable
  adminEmail = ''

  constructor(
    private familyService: FamilyService,
    private appService: AppService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.familyService.fetchStageMap()
  }

  async toggleChange() {
    await this.appService.changeAvailability()
  }

  ngOnInit(): void {
    this.adminEmail = this.authService.currentUser?.email ?? ''
    this.authService.user$.subscribe((user) => {
      this.adminEmail = user?.email ?? ''
    })
    this.familyService.listenIfTheatreIsOpen()
    this.appService.theatreIsOpen$.subscribe((response) => {
      if (response !== null) {
        this.theatreIsOpen = !!response
      }
    })
  }

  async logout(): Promise<void> {
    await this.authService.signOut()
    await this.router.navigateByUrl('/admin/login')
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
