import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  computed,
  signal,
} from '@angular/core'
import { Seat } from '../../../model/Seat'
import { FormsModule } from '@angular/forms'
import { TailwindClassDirective } from '../../directives/tailwind-class.directive'
import { FamilyService } from '../../family.service'
import { ToasterService } from '../../toaster.service'

@Component({
  selector: 'app-modal-admin-seat-assign',
  templateUrl: './modal-admin-seat-assign.component.html',
  imports: [FormsModule, TailwindClassDirective],
  standalone: true,
})
export class ModalAdminSeatAssignComponent implements OnInit {
  isOpen: boolean = false
  @Input() seat!: Seat
  @Input() sectionName!: string
  errorOnAssign = signal<boolean>(false)
  // Propiedad interna que enlazará con ngModel
  internalFamilyCode: number | null = null

  @Output() close = new EventEmitter<void>()

  constructor(
    private familyService: FamilyService,
    private toasterService: ToasterService,
  ) {}

  sectionNameFormatted = computed(() => {
    return this.sectionName ? this.sectionName.split('-')[1] : ''
  })

  ngOnInit() {
    // Inicializamos el valor de internalFamilyCode con currentFamilyCode
    this.internalFamilyCode = this.seat ? this.seat.familyCode : null
  }

  // Método para abrir el modal
  openModal() {
    this.isOpen = true
  }

  // Método para cerrar el modal
  closeModal() {
    this.isOpen = false
  }

  blockSeat() {
    try {
      if (this.seat.row) {
        this.familyService.reservateIndividualSeatByAdmin(
          this.sectionName,
          this.seat,
          99999, // Código especial para bloquear asiento
        )
      } else {
        this.familyService.reservateIndividualBoxByAdmin(
          this.sectionName,
          this.seat,
          99999, // Código especial para bloquear asiento
        )
      }
      this.closeModal()
    } catch (error) {
      this.errorOnAssign.set(true)
    }
  }

  assignSeat() {
    try {
      if (this.seat.row) {
        this.familyService.reservateIndividualSeatByAdmin(
          this.sectionName,
          this.seat,
          this.internalFamilyCode,
        )
      } else {
        this.familyService.reservateIndividualBoxByAdmin(
          this.sectionName,
          this.seat,
          this.internalFamilyCode,
        )
      }
      this.closeModal()
    } catch (error) {
      console.log('error', error)
      this.errorOnAssign.set(true)
    }
  }

  freeSeat() {
    console.log('Liberar asiento')
  }
}
