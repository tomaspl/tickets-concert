import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { FamilyService } from '../../shared/family.service'
import { ThanksPageComponent } from '../thanks/thanks-page.component'
import { WaitingRoomPageComponent } from '../waiting-room/waiting-room-page.component'
import { StagePageComponent } from '../stage/stage-page.component'
import { WelcomePageComponent } from '../welcome/welcome-page.component'
import { take } from 'rxjs/operators'
import { ExpiredTimeComponent } from '../expired-time/expired-time-page.component'
import { SmallResolutionPageComponent } from '../small-resolution/small-resolution-page.component'
import { ErrorPageComponent } from '../error/error-page.component'
import { preventaAvailable } from '../../constants'
import { AppService } from '../../shared/app.service'

@Component({
  selector: 'main-page',
  standalone: true,
  imports: [
    WaitingRoomPageComponent,
    ThanksPageComponent,
    StagePageComponent,
    WelcomePageComponent,
    ExpiredTimeComponent,
    SmallResolutionPageComponent,
    ErrorPageComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainPageComponent implements OnInit {
  public showStage = false
  public showWaitingRoom = false
  public thanksPage = false

  public familyCode!: number
  public lastName!: string
  public availableSeats!: number
  public currentPage!: string
  public isFamilyAtSchool!: boolean

  public isScreenSmall: boolean = false

  constructor(
    private route: ActivatedRoute,
    private familyService: FamilyService,
    private appService: AppService,
  ) {}

  ngOnInit() {
    this.checkScreenSize()
    this.familyService.listenIfTheatreIsOpen()
    this.familyService.fetchStageMap()

    this.appService.theatreIsOpen.pipe(take(1)).subscribe((response) => {
      console.log('theatreIsOpen', response)

      if (response === false) {
        this.appService.setError('La boleteria se encuentra cerrada')
        this.appService.changePage('error')
      }
    })

    const familyId = this.route.snapshot.paramMap.get('id') || ''
    this.familyService.setFamilyId(familyId)
    this.checkFamily()
    this.familyService.getCurrentPage().subscribe((response) => {
      this.currentPage = response
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize()
  }

  private checkScreenSize(): void {
    this.isScreenSmall = window.innerWidth < 1000
  }

  async checkFamily() {
    const familyId = this.route.snapshot.paramMap.get('id') || ''
    this.isFamilyAtSchool = await this.familyService.familyOnSchool(familyId)
    if (this.isFamilyAtSchool) {
      this.familyService.lastName$.subscribe((response) => {
        this.lastName = response
      })
      this.familyService.availableSeats$.pipe(take(1)).subscribe((response) => {
        this.availableSeats = response
        this.familyService.preventa$.pipe(take(1)).subscribe((preventa) => {
          if (preventa && preventaAvailable) {
            this.appService.changePage('welcome')
          } else {
            if (!preventaAvailable && this.availableSeats > 0) {
              this.appService.changePage('welcome')
            } else {
              if (this.availableSeats < 1) {
                this.appService.changePage('thanks')
              } else {
                this.appService.setError('La boleteria se encuentra cerrada')
                this.appService.changePage('error')
              }
            }
          }
        })
      })
    } else {
      this.appService.setError('Página Inexistente')
      this.appService.changePage('error')
    }
  }
}
