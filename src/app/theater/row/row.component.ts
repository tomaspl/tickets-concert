import { Component, Input } from '@angular/core';
import { Seat } from '../../model/Seat';
import { SeatComponent } from "../seat/seat.component";

@Component({
  selector: 'app-row',
  standalone: true,
  imports: [SeatComponent],
  templateUrl: './row.component.html',
  styleUrl: './row.component.css'
})
export class RowComponent {
  @Input() sectionName!: string;
  @Input() seats!: Seat[];
}
