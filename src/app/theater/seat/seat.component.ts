import { Component, Input } from '@angular/core';
import { Seat } from '../../model/Seat';
import { FamilyService } from '../../shared/family.service';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../../shared/toaster.service';
import { availableSoon, preventaAvailable } from '../../constants';

@Component({
  selector: 'app-seat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.css',
})
export class SeatComponent {
  @Input() sectionName!: string;
  @Input() seat!: Seat;

  public currentFamilyCode: number;
  public selected = false;
  preventa = preventaAvailable;
  availableSoon = availableSoon;
  constructor(
    private familyService: FamilyService,
    private toasterService: ToasterService
  ) {
    this.currentFamilyCode = this.familyService.familyCode;
  }

  selectSeat(seat: Seat, sectionName: string) {
    if (seat.enabled || !this.preventa) {
      this.selected = this.familyService.selectSeat(seat, sectionName);
    } else {
      this.toasterService.showToaster(this.availableSoon);
    }
  }

  seatOfOtherUser() {
    this.toasterService.showToaster(
      'El lugar ya ha sido reservado por otra familia'
    );
  }

  seatAlreadyReservated() {
    this.toasterService.showToaster(
      'El lugar ya ha sido confirmado para usted'
    );
  }
}
