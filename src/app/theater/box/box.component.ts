import { Component, Input } from '@angular/core';
import { Seat } from '../../model/Seat';
import { FamilyService } from '../../shared/family.service';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../../shared/toaster.service';
import { availableSoon, preventaAvailable } from '../../constants';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css',
})
export class BoxComponent {
  @Input() sectionName!: string;
  @Input() seat!: Seat;

  public selected = false;

  public currentFamilyCode: number;
  preventa = preventaAvailable;
  availableSoon = availableSoon;

  constructor(
    private familyService: FamilyService,
    private toasterService: ToasterService
  ) {
    this.currentFamilyCode = this.familyService.familyCode;
  }

  selectBox(seat: Seat | null, sectionName: string) {
    if ((seat && seat.enabled) || !this.preventa) {
      this.selected = this.familyService.selectBox(seat, sectionName);
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
