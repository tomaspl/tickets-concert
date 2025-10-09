import { Component, computed, Input } from '@angular/core'
import { Seat } from '../../model/Seat'
import { FamilyService } from '../../shared/family.service'
import { CommonModule } from '@angular/common'
import { ToasterService } from '../../shared/toaster.service'
import { availableSoon, preventaAvailable } from '../../constants'
import { TailwindClassDirective } from '../../shared/directives/tailwind-class.directive'
import { ModalAdminSeatAssignComponent } from '../../shared/components/modal-admin-seat-assign/modal-admin-seat-assign.component'
import { ModalAdminSeatFreeComponent } from '../../shared/components/modal-admin-seat-free/modal-admin-seat-free.component'

@Component({
  selector: 'app-seat',
  standalone: true,
  imports: [
    CommonModule,
    TailwindClassDirective,
    ModalAdminSeatAssignComponent,
    ModalAdminSeatFreeComponent,
  ],
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.css',
})
export class SeatComponent {
  @Input() sectionName!: string
  @Input() seat!: Seat

  public currentFamilyCode: number
  public selected = false
  preventa = preventaAvailable
  availableSoon = availableSoon
  adminLookingAOccupiedSeat = computed(() => {
    return !this.currentFamilyCode && this.seat && this.seat.lastName
  })
  adminLookingAAvailableSeat = computed(() => {
    return (
      !this.currentFamilyCode &&
      this.seat &&
      this.seat.seat &&
      this.seat.seat > 0 &&
      !this.seat.lastName
    )
  })

  userLookingAOcupiedSeat = computed(() => {
    return (
      this.currentFamilyCode &&
      this.seat.familyCode &&
      this.seat.familyCode !== this.currentFamilyCode
    )
  })

  userLookingTheirOwnSeat = computed(() => {
    return (
      this.currentFamilyCode &&
      this.seat.familyCode &&
      this.seat.familyCode === this.currentFamilyCode
    )
  })

  userLookingAAvailableSeat = computed(() => {
    return (
      this.currentFamilyCode &&
      this.seat &&
      this.seat.seat &&
      this.seat.seat > 0 &&
      !this.seat.familyCode
    )
  })

  constructor(
    private familyService: FamilyService,
    private toasterService: ToasterService,
  ) {
    this.currentFamilyCode = this.familyService.familyCode
  }

  selectSeat(seat: Seat, sectionName: string) {
    if (seat.enabled || !this.preventa) {
      this.selected = this.familyService.selectSeat(seat, sectionName)
    } else {
      this.toasterService.showToaster(this.availableSoon)
    }
  }

  seatOfOtherUser() {
    this.toasterService.showToaster(
      'El lugar ya ha sido reservado por otra familia',
    )
  }

  seatAlreadyReservated() {
    this.toasterService.showToaster('El lugar ya ha sido confirmado para usted')
  }
}
