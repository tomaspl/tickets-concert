import { Component, Input } from '@angular/core'
import { Seat } from '../../model/Seat'
import { SeatComponent } from '../seat/seat.component'

@Component({
  selector: 'app-row',
  standalone: true,
  imports: [SeatComponent],
  template: `<div class="grid grid-flow-col items-start justify-center">
    @for (seat of seats; track seat) {
      <app-seat [sectionName]="sectionName" [seat]="seat"></app-seat>
    }
  </div> `,
})
export class RowComponent {
  @Input() sectionName!: string
  @Input() seats!: Seat[]
}
