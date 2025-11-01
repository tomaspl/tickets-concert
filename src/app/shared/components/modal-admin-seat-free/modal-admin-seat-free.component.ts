import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  computed,
} from '@angular/core'
import { Seat } from '../../../model/Seat'
import { FormsModule } from '@angular/forms'
import { TailwindClassDirective } from '../../directives/tailwind-class.directive'
import { FamilyService } from '../../family.service'

@Component({
  selector: 'app-modal-admin-seat-free',
  templateUrl: './modal-admin-seat-free.component.html',
  imports: [FormsModule, TailwindClassDirective],
  standalone: true,
})
export class ModalAdminSeatFreeComponent implements OnInit {
  isOpen: boolean = false
  @Input() seat!: Seat
  @Input() sectionName!: string

  @Output() close = new EventEmitter<void>()

  constructor(private familyService: FamilyService) {}

  sectionNameFormatted = computed(() => {
    return this.sectionName ? this.sectionName.split('-')[1] : ''
  })

  ngOnInit() {}

  // Método para abrir el modal
  openModal() {
    this.isOpen = true
  }

  // Método para cerrar el modal
  closeModal() {
    this.isOpen = false
  }

  freeSeat() {
    this.familyService.freeIndividualSeatByAdmin(this.sectionName, this.seat)
    this.closeModal()
  }
}
