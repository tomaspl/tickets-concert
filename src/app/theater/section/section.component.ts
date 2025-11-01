import { Component, Input } from '@angular/core'
import { Seat } from '../../model/Seat'
import { FamilyService } from '../../shared/family.service'
import { RowComponent } from '../row/row.component'
import { CommonModule } from '@angular/common'
import { BoxesColumnComponent } from '../boxes-column/boxes-column.component'

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [BoxesColumnComponent, RowComponent, CommonModule],
  template: `<div class="row-auto">
    @if (sectionName.includes('Palcos')) {
      <app-boxes-column
        [sectionName]="sectionName"
        [seatsRow]="seatsRow"
      ></app-boxes-column>
    } @else {
      <app-row [sectionName]="sectionName" [seats]="seatsRow"></app-row>
    }
  </div> `,
})
export class SectionComponent {
  @Input() sectionName!: string
  @Input() seatsRow!: Seat[]

  public selected = false
  constructor(private familyService: FamilyService) {}

  selectSeat(seat: Seat | null, sectionName: string) {
    this.selected = this.familyService.selectSeat(seat, sectionName)
  }
}
