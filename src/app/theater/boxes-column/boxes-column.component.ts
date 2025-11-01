import { Component, Input } from '@angular/core'
import { Seat } from '../../model/Seat'
import { FamilyService } from '../../shared/family.service'
import { CommonModule } from '@angular/common'
import { BoxComponent } from '../box/box.component'

@Component({
  selector: 'app-boxes-column',
  standalone: true,
  imports: [BoxComponent, CommonModule],
  template: `@for (seat of seatsRow; track seat; let i = $index) {
    <app-box [seat]="seat" [sectionName]="sectionName"></app-box>
  } `,
  styleUrl: './boxes-column.component.css',
})
export class BoxesColumnComponent {
  @Input() sectionName!: string
  @Input() seatsRow!: Seat[]

  public selected = false
  constructor(private familyService: FamilyService) {}

  selectSeat(seat: Seat | null, sectionName: string) {
    this.selected = this.familyService.selectSeat(seat, sectionName)
  }
}
