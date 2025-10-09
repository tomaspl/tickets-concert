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
  templateUrl: './thanks-page.component.html',
  styleUrl: './thanks-page.component.css',
})
export class ThanksPageComponent {
  public details$: Observable<Reservation[] | null>
  thanksMessage = thanksMessage
  returnMessage = returnMessage
  constructor(private familyService: FamilyService) {
    this.details$ = this.familyService.details$
  }
}
