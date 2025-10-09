import { Component, OnInit } from '@angular/core'
import { FamilyService } from '../../shared/family.service'
import { Observable, of } from 'rxjs'
import { Reservation } from '../../model/Reservation'
import { CommonModule } from '@angular/common'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'reservation-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
})
export class ReservationPageComponent implements OnInit {
  public details$!: Observable<Reservation[] | null>
  public lastName$!: Observable<string>
  public isFamilyAtSchool!: boolean
  constructor(
    private familyService: FamilyService,
    private route: ActivatedRoute,
  ) {
    const id = this.route.snapshot.paramMap.get('id') || ''
    this.familyService.fetchStageMap(id)
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || ''

    this.details$ = this.familyService.details$
    this.lastName$ = this.familyService.lastName$
    this.fetchFamilyData(id)
  }

  async fetchFamilyData(id: string) {
    this.isFamilyAtSchool = await this.familyService.familyOnSchool(id)
    this.lastName$ = this.familyService.lastName$
  }
}
