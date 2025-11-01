import { Component } from '@angular/core'
import { FamilyService } from '../../shared/family.service'
import { Observable } from 'rxjs'
import { Reservation } from '../../model/Reservation'
import { CommonModule } from '@angular/common'
import { returnMessage, thanksMessage } from '../../constants'

@Component({
  selector: 'thanks-page',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="flex flex-col place-content-center">
    <ul class="bg-transparent mt-3">
      <br />
      @for (reservation of details$ | async; track reservation) {
        @if (reservation.row) {
          <li class="bg-transparent">
            {{ reservation.sectionName.split('-')[1] }} - Fila:
            {{ reservation.row }} - Asiento: {{ reservation.seat }}
          </li>
        } @else {
          <li class="bg-transparent">
            {{ reservation.sectionName.split('-')[1] }} - Palco:
            {{ reservation.seat }}
          </li>
        }
      }
    </ul>
    <br />
    <img src="assets/images/thanks.gif" class="w-4/12 m-auto" alt="Gracias" />
  </div> `,
})
export class ThanksPageComponent {
  public details$: Observable<Reservation[] | null>
  thanksMessage = thanksMessage
  returnMessage = returnMessage
  constructor(private familyService: FamilyService) {
    this.details$ = this.familyService.details$
  }
}
