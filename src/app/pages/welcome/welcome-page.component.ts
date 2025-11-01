import { Component } from '@angular/core'
import { FamilyService } from '../../shared/family.service'
import { Observable } from 'rxjs'
import { CommonModule } from '@angular/common'
import { AppService } from '../../shared/app.service'
import { TailwindClassDirective } from '../../shared/directives/tailwind-class.directive'

@Component({
  selector: 'welcome-page',
  standalone: true,
  imports: [CommonModule, TailwindClassDirective],
  template: `<div *ngIf="lastName">
      <ng-container>
        <p class="mt-6 text-lg leading-8 text-gray-600">
          A continuación podrá reservar entradas para el "Concert 2025: Art
          Comes Alive" que se realizará el día martes 18 de noviembre.
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <button
            (click)="goToWaitingRoom()"
            [appTailwindClass]="'btn-primary'"
          >
            Comenzar
          </button>
        </div>
      </ng-container>
    </div>

    <ng-template #noSeatsAvailable>
      <p class="mt-6 text-lg leading-8 text-gray-600">
        Las entradas para su familia ya fueron reservadas
      </p>
    </ng-template>

    <div *ngIf="!lastName">
      <div class="p-4 max-w-sm w-full mx-auto flex justify-center">
        <svg [appTailwindClass]="'btn-cumbres'" viewBox="0 0 24 24"></svg>
      </div>
    </div> `,
})
export class WelcomePageComponent {
  lastName!: string
  availableSeats$!: Observable<number>
  constructor(
    private familyService: FamilyService,
    private appService: AppService,
  ) {}
  ngOnInit() {
    this.familyService.lastName$.subscribe((response) => {
      this.lastName = response
    })

    this.availableSeats$ = this.familyService.availableSeats$
  }
  goToWaitingRoom() {
    this.appService.changePage('waiting')
  }
}
